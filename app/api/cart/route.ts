import { NextRequest, NextResponse } from 'next/server';
import { mapCartItem } from '@/lib/supabase/mappers';
import { createSupabaseRouteClient, getSupabaseUserFromBearerToken } from '@/lib/supabase/server';

async function getOrCreateCart(supabase: ReturnType<typeof createSupabaseRouteClient>, userId: string) {
  const { data: existingCart, error: fetchError } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (existingCart) return existingCart;

  const { data: cart, error } = await supabase
    .from('carts')
    .insert({ user_id: userId })
    .select('*')
    .single();

  if (error) throw error;
  return cart;
}

export async function GET(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    const { user, error: authError } = await getSupabaseUserFromBearerToken(authorization);

    if (!user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const supabase = createSupabaseRouteClient(authorization);
    const cart = await getOrCreateCart(supabase, user.id);
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const items = (data || []).map(mapCartItem);

    return NextResponse.json({
      message: 'Cart fetched successfully',
      cart: { id: cart.id, userId: user.id, items },
      items,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    const { user, error: authError } = await getSupabaseUserFromBearerToken(authorization);

    if (!user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const body = await req.json();
    const productId = body.productId;
    const productName = body.productName || body.name;
    const price = Number(body.price);
    const quantity = Number(body.quantity || 1);
    const size = body.size || null;
    const color = body.color || null;
    const image = body.image || null;

    if (!productId || !productName || !price) {
      return NextResponse.json({ error: 'Missing required cart item fields' }, { status: 400 });
    }

    const supabase = createSupabaseRouteClient(authorization);
    const cart = await getOrCreateCart(supabase, user.id);
    let existingQuery = supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .eq('product_id', productId);

    existingQuery = size ? existingQuery.eq('size', size) : existingQuery.is('size', null);
    existingQuery = color ? existingQuery.eq('color', color) : existingQuery.is('color', null);

    const { data: existing, error: existingError } = await existingQuery.maybeSingle();

    if (existingError) throw existingError;

    if (existing) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabase.from('cart_items').insert({
        cart_id: cart.id,
        product_id: productId,
        product_name: productName,
        price,
        quantity,
        size,
        color,
        image,
      });

      if (error) throw error;
    }

    return GET(req);
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

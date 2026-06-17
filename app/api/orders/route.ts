import { NextRequest, NextResponse } from 'next/server';
import { getAdminEmail, sendEmail } from '@/lib/email';
import { isAdminUser } from '@/lib/supabase/admin';
import { mapCartItem, mapOrder } from '@/lib/supabase/mappers';
import { createSupabaseRouteClient, getSupabaseUserFromBearerToken } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    const { user, error: authError } = await getSupabaseUserFromBearerToken(authorization);

    if (!user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const supabase = createSupabaseRouteClient(authorization);
    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (!isAdminUser(user)) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({
      message: 'Orders fetched successfully',
      orders: (data || []).map(mapOrder),
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
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
    const supabase = createSupabaseRouteClient(authorization);

    const { data: cart } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart?.id || '00000000-0000-0000-0000-000000000000');

    if (cartError) throw cartError;

    const items = (body.items?.length ? body.items : cartItems || []).map(mapCartItem);
    if (!items.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const subtotal = Number(body.subtotal ?? items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0));
    const tax = Number(body.tax ?? subtotal * 0.1);
    const shipping = Number(body.shipping ?? (subtotal > 150000 ? 0 : 2500));
    const total = Number(body.total ?? subtotal + tax + shipping);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        subtotal,
        tax,
        shipping,
        total,
        shipping_address: body.shippingAddress || {},
        payment_method: body.paymentMethod || 'bank_transfer',
        payment_status: 'pending',
        status: 'pending',
      })
      .select('*')
      .single();

    if (orderError) throw orderError;

    const { error: itemError } = await supabase.from('order_items').insert(
      items.map((item: any) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName || item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null,
        image: item.image || null,
      }))
    );

    if (itemError) throw itemError;

    if (cart?.id) {
      await supabase.from('cart_items').delete().eq('cart_id', cart.id);
    }

    const { data: hydrated } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', order.id)
      .single();

    return NextResponse.json({
      message: 'Order created successfully',
      order: mapOrder(hydrated || { ...order, order_items: [] }),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

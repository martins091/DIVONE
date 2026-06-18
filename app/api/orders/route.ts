import { NextRequest, NextResponse } from 'next/server';
import { getAdminEmail, sendEmail } from '@/lib/email';
import { isAdminUser } from '@/lib/supabase/admin';
import { mapCartItem, mapOrder } from '@/lib/supabase/mappers';
import { createSupabaseRouteClient, getSupabaseUserFromBearerToken } from '@/lib/supabase/server';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message?: unknown }).message);
  }
  return String(error);
}

function getSupabaseErrorCode(error: unknown) {
  if (error && typeof error === 'object' && 'code' in error) {
    return String((error as { code?: unknown }).code);
  }
  return '';
}

function createOrderErrorResponse(error: unknown) {
  const message = getErrorMessage(error);
  const code = getSupabaseErrorCode(error);
  const normalizedMessage = message.toLowerCase();

  if (
    code === 'PGRST202' ||
    code === '42883' ||
    code === '42703' ||
    normalizedMessage.includes('create_guest_order') ||
    normalizedMessage.includes('guest_access_token')
  ) {
    return NextResponse.json(
      {
        error: 'Guest checkout is not ready yet. Run the Supabase migration 20260618120000_guest_orders.sql, then try again.',
        detail: message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error: 'Failed to create order',
      ...(process.env.NODE_ENV !== 'production' ? { detail: message } : {}),
    },
    { status: 500 }
  );
}

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

    if (authorization && !user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const body = await req.json();
    const supabase = createSupabaseRouteClient(authorization);

    let cart = null;
    let cartItems: any[] = [];

    if (user) {
      const { data: existingCart } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      cart = existingCart;

      const { data: existingCartItems, error: cartError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', cart?.id || '00000000-0000-0000-0000-000000000000');

      if (cartError) throw cartError;
      cartItems = existingCartItems || [];
    }

    const items = body.items?.length
      ? body.items.map((item: any) => ({
          productId: item.productId || item.product_id,
          productName: item.productName || item.name || item.product_name,
          name: item.name || item.productName || item.product_name,
          price: Number(item.price),
          quantity: Number(item.quantity || 1),
          size: item.size || null,
          color: item.color || null,
          image: item.image || null,
        }))
      : (cartItems || []).map(mapCartItem);
    if (!items.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const subtotal = Number(body.subtotal ?? items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0));
    const tax = Number(body.tax ?? subtotal * 0.1);
    const shipping = Number(body.shipping ?? (subtotal > 150000 ? 0 : 2500));
    const total = Number(body.total ?? subtotal + tax + shipping);

    if (!user) {
      const { data: guestOrder, error: guestOrderError } = await supabase.rpc('create_guest_order', {
        p_subtotal: subtotal,
        p_tax: tax,
        p_shipping: shipping,
        p_total: total,
        p_shipping_address: body.shippingAddress || {},
        p_payment_method: body.paymentMethod || 'bank_transfer',
        p_items: items,
      });

      if (guestOrderError) return createOrderErrorResponse(guestOrderError);

      return NextResponse.json({
        message: 'Order created successfully',
        order: mapOrder(guestOrder),
      }, { status: 201 });
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null,
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
    return createOrderErrorResponse(error);
  }
}

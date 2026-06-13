import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import Cart from '@/lib/models/Cart';
import { getSupabaseUserFromBearerToken } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { user, error } = await getSupabaseUserFromBearerToken(req.headers.get('authorization'));
    if (!user) {
      return NextResponse.json(
        { error },
        { status: 401 }
      );
    }
    const userId = user.id;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: 'Orders fetched successfully',
        orders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { user, error } = await getSupabaseUserFromBearerToken(req.headers.get('authorization'));
    if (!user) {
      return NextResponse.json(
        { error },
        { status: 401 }
      );
    }
    const userId = user.id;

    const { items, subtotal, tax, shipping, shippingAddress, paymentMethod } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    const total = subtotal + tax + shipping;

    const order = await Order.create({
      userId,
      items,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'completed',
      status: 'confirmed',
    });

    // Clear cart
    await Cart.updateOne({ userId }, { items: [] });

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

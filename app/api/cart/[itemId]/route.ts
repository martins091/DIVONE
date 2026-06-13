import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/lib/models/Cart';
import { getSupabaseUserFromBearerToken } from '@/lib/supabase/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    await connectDB();
    const { itemId } = await params;

    const { user, error } = await getSupabaseUserFromBearerToken(req.headers.get('authorization'));
    if (!user) {
      return NextResponse.json(
        { error },
        { status: 401 }
      );
    }
    const userId = user.id;

    const { quantity } = await req.json();

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    item.quantity = quantity;
    await cart.save();

    return NextResponse.json(
      {
        message: 'Cart item updated',
        cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    await connectDB();
    const { itemId } = await params;

    const { user, error } = await getSupabaseUserFromBearerToken(req.headers.get('authorization'));
    if (!user) {
      return NextResponse.json(
        { error },
        { status: 401 }
      );
    }
    const userId = user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    cart.items.id(itemId).deleteOne();
    await cart.save();

    return NextResponse.json(
      {
        message: 'Item removed from cart',
        cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}

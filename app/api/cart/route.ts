import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
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

    const cart = await Cart.findOne({ userId });

    return NextResponse.json(
      {
        message: 'Cart fetched successfully',
        cart: cart || { userId, items: [] },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
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

    const { productId, productName, price, quantity, size, color, image } = await req.json();

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, productName, price, quantity, size, color, image }],
      });
    } else {
      const existingItem = cart.items.find(
        (item: any) => item.productId === productId && item.size === size && item.color === color
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, productName, price, quantity, size, color, image });
      }

      await cart.save();
    }

    return NextResponse.json(
      {
        message: 'Item added to cart',
        cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

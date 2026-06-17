import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteClient, getSupabaseUserFromBearerToken } from '@/lib/supabase/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const authorization = req.headers.get('authorization');
    const { user, error: authError } = await getSupabaseUserFromBearerToken(authorization);

    if (!user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const { itemId } = await params;
    const { quantity } = await req.json();
    const supabase = createSupabaseRouteClient(authorization);
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: Number(quantity) })
      .eq('id', itemId);

    if (error) throw error;

    return NextResponse.json({ message: 'Cart item updated' });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const authorization = req.headers.get('authorization');
    const { user, error: authError } = await getSupabaseUserFromBearerToken(authorization);

    if (!user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const { itemId } = await params;
    const supabase = createSupabaseRouteClient(authorization);
    const { error } = await supabase.from('cart_items').delete().eq('id', itemId);

    if (error) throw error;

    return NextResponse.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 });
  }
}

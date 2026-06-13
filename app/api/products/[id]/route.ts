import { NextRequest, NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/supabase/admin';
import { mapProduct, toProductInsert } from '@/lib/supabase/mappers';
import { createSupabaseRouteClient, getSupabaseUserFromBearerToken } from '@/lib/supabase/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createSupabaseRouteClient();
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

    if (error || !data) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Product fetched successfully',
      product: mapProduct(data),
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = req.headers.get('authorization');
    const { user, error: authError } = await getSupabaseUserFromBearerToken(authorization);

    if (!user || !isAdminUser(user)) {
      return NextResponse.json({ error: authError || 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const supabase = createSupabaseRouteClient(authorization);
    const { data, error } = await supabase
      .from('products')
      .update(toProductInsert(body))
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Product updated successfully',
      product: mapProduct(data),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = req.headers.get('authorization');
    const { user, error: authError } = await getSupabaseUserFromBearerToken(authorization);

    if (!user || !isAdminUser(user)) {
      return NextResponse.json({ error: authError || 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const supabase = createSupabaseRouteClient(authorization);
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

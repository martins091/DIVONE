import { NextRequest, NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/supabase/admin';
import { mapProduct, toProductInsert } from '@/lib/supabase/mappers';
import { createSupabaseRouteClient, getSupabaseUserFromBearerToken } from '@/lib/supabase/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = createSupabaseRouteClient();
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

    if (error || !data) {
      console.error('GET Error:', error);
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
  { params }: { params: { id: string } }
) {
  try {
    const authorization = req.headers.get('authorization');
    const { user, error: authError } = await getSupabaseUserFromBearerToken(authorization);

    if (!user || !isAdminUser(user)) {
      return NextResponse.json({ error: authError || 'Admin access required' }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const supabase = createSupabaseRouteClient(authorization);
    
    console.log('🔵 Updating product:', id);
    console.log('📦 Update body:', body);
    
    // Check if this is a mark as sold operation
    if (body.isSold !== undefined || body.status === 'sold' || body.status === 'available') {
      const updateData: any = {};
      
      if (body.isSold !== undefined) {
        updateData.is_sold = body.isSold;
      }
      
      if (body.status) {
        updateData.status = body.status;
      }
      
      if (body.stock !== undefined) {
        updateData.stock = body.stock;
      }
      
      if (body.isSold === true || body.status === 'sold') {
        updateData.sold_date = new Date().toISOString();
        // Ensure status is set if not explicitly provided
        if (!body.status) updateData.status = 'sold';
      }
      
      if (body.isSold === false || body.status === 'available') {
        updateData.sold_date = null;
        // Ensure status is set if not explicitly provided
        if (!body.status) updateData.status = 'available';
      }
      
      console.log('🔄 Update data:', updateData);
      
      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('❌ Supabase update error:', error);
        return NextResponse.json({ 
          error: 'Failed to update product', 
          details: error.message 
        }, { status: 500 });
      }

      if (!data) {
        return NextResponse.json({ error: 'Product not found after update' }, { status: 404 });
      }

      console.log('✅ Product updated successfully:', data.id);
      
      return NextResponse.json({
        message: body.isSold ? 'Product marked as sold' : 'Product updated successfully',
        product: mapProduct(data),
      });
    }

    // Regular product update
    const { data, error } = await supabase
      .from('products')
      .update(toProductInsert(body))
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('❌ Supabase regular update error:', error);
      return NextResponse.json({ 
        error: 'Failed to update product', 
        details: error.message 
      }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    console.log('✅ Product updated successfully:', data.id);
    
    return NextResponse.json({
      message: 'Product updated successfully',
      product: mapProduct(data),
    });
  } catch (error) {
    console.error('❌ Error updating product:', error);
    return NextResponse.json({ 
      error: 'Failed to update product', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authorization = req.headers.get('authorization');
    const { user, error: authError } = await getSupabaseUserFromBearerToken(authorization);

    if (!user || !isAdminUser(user)) {
      return NextResponse.json({ error: authError || 'Admin access required' }, { status: 403 });
    }

    const { id } = params;
    const supabase = createSupabaseRouteClient(authorization);
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('❌ Delete error:', error);
      throw error;
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
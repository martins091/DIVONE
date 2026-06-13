import { NextRequest, NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/supabase/admin';
import { mapProduct, toProductInsert } from '@/lib/supabase/mappers';
import { createSupabaseRouteClient, getSupabaseUserFromBearerToken } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const supabase = createSupabaseRouteClient();
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });

    if (category) query = query.eq('category', category);
    if (featured === 'true') query = query.eq('is_featured', true);
    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Products fetched successfully',
      products: (data || []).map(mapProduct),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    const { user, error: authError } = await getSupabaseUserFromBearerToken(authorization);

    if (!user || !isAdminUser(user)) {
      return NextResponse.json({ error: authError || 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, price, category } = body;

    if (!name || !description || !price || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createSupabaseRouteClient(authorization);
    const { data, error } = await supabase
      .from('products')
      .insert(toProductInsert(body))
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Product created successfully',
      product: mapProduct(data),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/supabase/admin';
import { createSupabaseRouteClient, getSupabaseUserFromBearerToken } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    const { user, error: authError } = await getSupabaseUserFromBearerToken(authorization);

    if (!user || !isAdminUser(user)) {
      return NextResponse.json({ error: authError || 'Admin access required' }, { status: 403 });
    }

    const supabase = createSupabaseRouteClient(authorization);
    const [
      products,
      orders,
      pendingOrders,
      users,
      revenueRows,
    ] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }).in('status', ['pending', 'confirmed']),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('total').eq('payment_status', 'completed'),
    ]);

    const firstError = products.error || orders.error || pendingOrders.error || users.error || revenueRows.error;
    if (firstError) throw firstError;

    const revenue = (revenueRows.data || []).reduce((sum, order) => sum + Number(order.total || 0), 0);

    return NextResponse.json({
      products: products.count || 0,
      orders: orders.count || 0,
      pendingOrders: pendingOrders.count || 0,
      users: users.count || 0,
      revenue,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}

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
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, first_name, last_name, email, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('user_id, total');

    if (ordersError) throw ordersError;

    const metrics = new Map<string, { ordersCount: number; totalSpent: number }>();
    for (const order of orders || []) {
      const current = metrics.get(order.user_id) || { ordersCount: 0, totalSpent: 0 };
      current.ordersCount += 1;
      current.totalSpent += Number(order.total || 0);
      metrics.set(order.user_id, current);
    }

    return NextResponse.json({
      users: (profiles || []).map((profile) => {
        const userMetrics = metrics.get(profile.id) || { ordersCount: 0, totalSpent: 0 };
        return {
          id: profile.id,
          name: profile.full_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Customer',
          email: profile.email || 'No email',
          joinedDate: profile.created_at,
          ...userMetrics,
        };
      }),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

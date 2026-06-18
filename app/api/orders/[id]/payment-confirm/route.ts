import { NextRequest, NextResponse } from 'next/server';
import { sendPaymentSubmittedEmail } from '@/lib/email';
import { mapOrder } from '@/lib/supabase/mappers';
import { createSupabaseRouteClient, getSupabaseUserFromBearerToken } from '@/lib/supabase/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const authorization = req.headers.get('authorization');
    const { user, error: authError } = await getSupabaseUserFromBearerToken(authorization);

    if (authorization && !user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const guestAccessToken = user ? null : body.guestAccessToken || body.token || null;

    if (!user && !guestAccessToken) {
      return NextResponse.json({ error: 'Order access token required' }, { status: 401 });
    }

    const supabase = createSupabaseRouteClient(authorization);

    const { data, error } = await supabase.rpc('confirm_order_payment', {
      p_order_id: id,
      p_guest_access_token: guestAccessToken,
    });

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    await sendPaymentSubmittedEmail(data);

    return NextResponse.json({
      message: 'Payment confirmation received',
      order: mapOrder(data),
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { isAdminUser } from '@/lib/supabase/admin';
import { mapOrder } from '@/lib/supabase/mappers';
import { createSupabaseRouteClient, getSupabaseUserFromBearerToken } from '@/lib/supabase/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authorization = req.headers.get('authorization');
    const { searchParams } = new URL(req.url);
    const guestAccessToken = searchParams.get('token');
    const { user, error: authError } = await getSupabaseUserFromBearerToken(authorization);

    if (authorization && !user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const { id } = params;
    const supabase = createSupabaseRouteClient(authorization);

    if (!user) {
      const { data, error } = await supabase.rpc('get_order_for_tracking', {
        p_order_id: id,
        p_guest_access_token: guestAccessToken,
      });

      if (error) throw error;

      if (!data) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Order fetched successfully', order: mapOrder(data) });
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!isAdminUser(user) && data.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ message: 'Order fetched successfully', order: mapOrder(data) });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
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
    const updates: Record<string, unknown> = {};

    if (body.status) updates.status = body.status;
    if (body.paymentStatus) updates.payment_status = body.paymentStatus;
    if (body.trackingNumber !== undefined) updates.tracking_number = body.trackingNumber;
    if (body.notes !== undefined) updates.notes = body.notes;

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select('*, order_items(*)')
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (body.paymentStatus === 'completed' || body.status === 'confirmed') {
      const email = data.shipping_address?.email;
      if (email) {
        await sendEmail({
          to: email,
          subject: `DIVONE order ${data.order_number} approved`,
          html: `<p>Your order <strong>${data.order_number}</strong> has been approved.</p><p>Status: ${data.status}</p><p>You can track it from your DIVONE account.</p>`,
        });
      }
    }

    return NextResponse.json({ message: 'Order updated successfully', order: mapOrder(data) });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

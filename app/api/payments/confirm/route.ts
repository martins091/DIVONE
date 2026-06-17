import { NextRequest, NextResponse } from 'next/server';
import { getAdminEmail, sendEmail } from '@/lib/email';
import { isAdminUser } from '@/lib/supabase/admin';
import { createSupabaseRouteClient, getSupabaseUserFromBearerToken } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    const { user, error: authError } = await getSupabaseUserFromBearerToken(authorization);

    if (!user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const body = await request.json();
    const {
      orderId,
      fullName,
      phone,
      email,
      transactionReference,
      screenshotUrl,
      amount,
    } = body;

    if (!fullName || !phone || !email || !transactionReference || !screenshotUrl || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createSupabaseRouteClient(authorization);
    const { data, error } = await supabase
      .from('payment_confirmations')
      .insert({
        order_id: orderId || null,
        user_id: user.id,
        full_name: fullName,
        phone,
        email,
        transaction_reference: transactionReference,
        screenshot_url: screenshotUrl,
        amount: Number(amount),
        status: 'pending',
      })
      .select('*')
      .single();

    if (error) throw error;

    const adminEmail = getAdminEmail();
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: 'New DIVONE payment confirmation',
        html: `<p>A customer submitted payment confirmation.</p><p><strong>Name:</strong> ${fullName}</p><p><strong>Email:</strong> ${email}</p><p><strong>Amount:</strong> ${amount}</p><p><strong>Reference:</strong> ${transactionReference}</p>`,
      });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating payment confirmation:', error);
    return NextResponse.json({ error: 'Failed to submit payment confirmation' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    const { user, error: authError } = await getSupabaseUserFromBearerToken(authorization);

    if (!user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const supabase = createSupabaseRouteClient(authorization);
    let query = supabase
      .from('payment_confirmations')
      .select('*')
      .order('created_at', { ascending: false });

    if (orderId) query = query.eq('order_id', orderId);
    if (!isAdminUser(user)) query = query.eq('user_id', user.id);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ confirmations: data || [] });
  } catch (error) {
    console.error('Error fetching payment confirmation:', error);
    return NextResponse.json({ error: 'Failed to fetch payment confirmation' }, { status: 500 });
  }
}

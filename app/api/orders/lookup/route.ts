import { NextRequest, NextResponse } from 'next/server';
import { mapOrder } from '@/lib/supabase/mappers';
import { createSupabaseRouteClient, getSupabaseUserFromBearerToken } from '@/lib/supabase/server';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message?: unknown }).message);
  }
  return String(error);
}

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('authorization');
    const { user, error: authError } = await getSupabaseUserFromBearerToken(authorization);

    if (authorization && !user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const body = await req.json();
    const orderReference = String(body.orderReference || '').trim();
    const contact = String(body.contact || '').trim();

    if (!orderReference || !contact) {
      return NextResponse.json({ error: 'Order number and email or phone are required' }, { status: 400 });
    }

    const supabase = createSupabaseRouteClient(authorization);
    const { data, error } = await supabase.rpc('lookup_order_for_tracking', {
      p_order_reference: orderReference,
      p_contact: contact,
    });

    if (error) {
      const message = getErrorMessage(error);
      return NextResponse.json(
        {
          error: message.toLowerCase().includes('lookup_order_for_tracking')
            ? 'Order lookup is not ready yet. Run the latest guest order tracking SQL, then try again.'
            : 'Failed to look up order',
          detail: process.env.NODE_ENV !== 'production' ? message : undefined,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: 'Order not found. Check the order number and contact details.' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Order found',
      order: mapOrder(data),
    });
  } catch (error) {
    console.error('Error looking up order:', error);
    return NextResponse.json(
      {
        error: 'Failed to look up order',
        detail: process.env.NODE_ENV !== 'production' ? getErrorMessage(error) : undefined,
      },
      { status: 500 }
    );
  }
}

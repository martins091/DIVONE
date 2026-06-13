import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PaymentConfirmation from '@/lib/models/PaymentConfirmation';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      orderId,
      userId,
      fullName,
      phone,
      email,
      transactionReference,
      screenshotUrl,
      amount,
    } = body;

    // Validate required fields
    if (
      !orderId ||
      !userId ||
      !fullName ||
      !phone ||
      !email ||
      !transactionReference ||
      !screenshotUrl ||
      !amount
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if transaction reference already exists
    const existingPayment = await PaymentConfirmation.findOne({
      transactionReference,
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: 'Transaction reference already submitted' },
        { status: 400 }
      );
    }

    const paymentConfirmation = await PaymentConfirmation.create({
      orderId,
      userId,
      fullName,
      phone,
      email,
      transactionReference,
      screenshotUrl,
      amount,
      status: 'pending',
    });

    return NextResponse.json(paymentConfirmation, { status: 201 });
  } catch (error) {
    console.error('Error creating payment confirmation:', error);
    return NextResponse.json(
      { error: 'Failed to submit payment confirmation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const confirmation = await PaymentConfirmation.findOne({ orderId });
    return NextResponse.json(confirmation || { error: 'Not found' });
  } catch (error) {
    console.error('Error fetching payment confirmation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment confirmation' },
      { status: 500 }
    );
  }
}

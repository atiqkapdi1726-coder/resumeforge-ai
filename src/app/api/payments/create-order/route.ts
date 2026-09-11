import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';
import Razorpay from 'razorpay';

const isRazorpayConfigured = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

const razorpay = isRazorpayConfigured
  ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! })
  : null;

export async function POST(request: Request) {
  try {
    if (!isRazorpayConfigured) {
      return NextResponse.json(
        { error: 'Payment system is not configured. Please add Razorpay credentials.' },
        { status: 503 }
      );
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decoded = await getAdminAuth().verifyIdToken(token);

    const { plan } = await request.json();

    if (!plan || !['pro', 'annual'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const amount = plan === 'pro' ? 19900 : 99900; // in paise

    const order = await razorpay!.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${decoded.uid}_${Date.now()}`,
      notes: {
        userId: decoded.uid,
        plan,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

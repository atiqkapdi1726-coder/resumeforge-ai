import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';
import crypto from 'crypto';

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

export async function POST(request: Request) {
  try {
    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }

    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const userId = payment.notes?.userId;
      const plan = payment.notes?.plan;

      if (userId && plan) {
        const now = new Date();
        const endDate = new Date(now);
        if (plan === 'annual') {
          endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
          endDate.setMonth(endDate.getMonth() + 1);
        }

        await getAdminDb().collection('users').doc(userId).set(
          {
            subscription: {
              plan,
              status: 'active',
              startDate: now.toISOString(),
              endDate: endDate.toISOString(),
              razorpayPaymentId: payment.id,
            },
          },
          { merge: true }
        );

        await getAdminDb().collection('usage').doc(userId).set(
          {
            resumesCreated: 0,
            atsChecks: 0,
            aiImprovements: 0,
            pdfDownloads: 0,
            lastUpdated: now.toISOString(),
          },
          { merge: true }
        );
      }
    }

    if (event.event === 'subscription.cancelled') {
      const subscription = event.payload.subscription.entity;
      const userId = subscription.notes?.userId;

      if (userId) {
        await getAdminDb().collection('users').doc(userId).set(
          {
            subscription: {
              plan: 'free',
              status: 'canceled',
            },
          },
          { merge: true }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

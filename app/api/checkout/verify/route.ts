import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
  return new Stripe(apiKey, {
    apiVersion: '2026-06-24.dahlia',
  });
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ paid: false, error: 'Missing session_id' }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ paid: false, error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY.' }, { status: 500 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({ paid: session.payment_status === 'paid' });
  } catch (err) {
    console.error('Session verification error:', err);
    return NextResponse.json({ paid: false, error: 'Could not verify session' }, { status: 400 });
  }
}
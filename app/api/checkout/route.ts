import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getShop } from '../../../lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-24.dahlia',
});

interface CheckoutRequestItem {
  id: number;
  qty: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cartItems: CheckoutRequestItem[] = body.cartItems;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const shopItems = getShop();

    const line_items = cartItems.map(item => {
      const product = shopItems.find(p => p.id === item.id);
      if (!product) {
        throw new Error(`Product with id ${item.id} no longer exists`);
      }
      if (!Number.isInteger(item.qty) || item.qty < 1) {
        throw new Error(`Invalid quantity for product ${item.id}`);
      }
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.size ? `${product.title} (${product.size})` : product.title,
            images: product.image ? [product.image] : undefined,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.qty,
      };
    });

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout session error:', err);
    const message = err instanceof Error ? err.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
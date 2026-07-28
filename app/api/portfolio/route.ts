import { NextResponse } from 'next/server';
import { getPortfolio } from '../../../lib/db';

export async function GET() {
  try {
    const items = getPortfolio();
    return NextResponse.json(items);
  } catch (err) {
    console.error('Portfolio fetch error:', err);
    return NextResponse.json({ error: 'Failed to load portfolio' }, { status: 500 });
  }
}
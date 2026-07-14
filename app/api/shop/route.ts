import { NextResponse } from 'next/server';
import { getShop } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const shop = getShop();
    return NextResponse.json(shop);
  } catch (error) {
    console.error("API Error in GET /api/shop:", error);
    return NextResponse.json({ error: 'Failed to fetch shop data' }, { status: 500 });
  }
}

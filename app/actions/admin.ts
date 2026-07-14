'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { 
  createSession, 
  isValidSession, 
  deleteSession,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  addShopItem,
  updateShopItem,
  deleteShopItem
} from '../../lib/db';

// Verify session helper
async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token || !isValidSession(token)) {
    throw new Error('Unauthorized');
  }
}

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin-secure-2026';

  if (username !== expectedUsername || password !== expectedPassword) {
    return { error: 'Invalid credentials' };
  }

  const token = createSession();
  const cookieStore = await cookies();
  
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: parseInt(process.env.SESSION_MAX_AGE_DAYS || '7', 10) * 24 * 60 * 60,
  });

  redirect('/admin-panel');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (token) {
    deleteSession(token);
  }
  cookieStore.delete('admin_session');
  redirect('/');
}

// Portfolio Actions
export async function addPortfolioAction(data: { title: string; category: string; image: string }) {
  try {
    await verifyAdmin();
    if (!data.title || !data.category || !data.image) {
      return { error: 'All fields are required' };
    }
    const newItem = addPortfolioItem(data);
    revalidatePath('/');
    revalidatePath('/api/portfolio');
    return { success: true, item: newItem };
  } catch (error: any) {
    return { error: error.message || 'Unauthorized' };
  }
}

export async function editPortfolioAction(id: number, data: { title: string; category: string; image: string }) {
  try {
    await verifyAdmin();
    const updated = updatePortfolioItem(id, data);
    if (!updated) return { error: 'Item not found' };
    revalidatePath('/');
    revalidatePath('/api/portfolio');
    return { success: true, item: updated };
  } catch (error: any) {
    return { error: error.message || 'Unauthorized' };
  }
}

export async function deletePortfolioAction(id: number) {
  try {
    await verifyAdmin();
    const deleted = deletePortfolioItem(id);
    if (!deleted) return { error: 'Item not found' };
    revalidatePath('/');
    revalidatePath('/api/portfolio');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Unauthorized' };
  }
}

// Shop Actions
export async function addShopAction(data: { title: string; price: number; image: string; size: string }) {
  try {
    await verifyAdmin();
    if (!data.title || isNaN(data.price) || !data.image) {
      return { error: 'Valid title, price, and image are required' };
    }
    const newItem = addShopItem(data);
    revalidatePath('/shop');
    revalidatePath('/api/shop');
    return { success: true, item: newItem };
  } catch (error: any) {
    return { error: error.message || 'Unauthorized' };
  }
}

export async function editShopAction(id: number, data: { title: string; price: number; image: string; size: string }) {
  try {
    await verifyAdmin();
    const updated = updateShopItem(id, data);
    if (!updated) return { error: 'Item not found' };
    revalidatePath('/shop');
    revalidatePath('/api/shop');
    return { success: true, item: updated };
  } catch (error: any) {
    return { error: error.message || 'Unauthorized' };
  }
}

export async function deleteShopAction(id: number) {
  try {
    await verifyAdmin();
    const deleted = deleteShopItem(id);
    if (!deleted) return { error: 'Item not found' };
    revalidatePath('/shop');
    revalidatePath('/api/shop');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Unauthorized' };
  }
}

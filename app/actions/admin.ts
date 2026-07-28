'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { 
  createSessionForUser, 
  getSessionUser, 
  deleteSession,
  getUserByUsername,
  hashPassword,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  addShopItem,
  updateShopItem,
  deleteShopItem,
  AdminPermission,
  AdminRole
} from '../../lib/db';

// RBAC Verification Helper
export async function verifyAdmin(requiredPermission?: AdminPermission) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) {
    throw new Error('Unauthorized: Session required');
  }

  const currentUser = getSessionUser(token);
  if (!currentUser) {
    throw new Error('Unauthorized: Invalid or expired session');
  }

  if (requiredPermission) {
    const isSuperAdmin = currentUser.role === 'super_admin';
    const hasPerm = currentUser.permissions && currentUser.permissions.includes(requiredPermission);
    
    if (!isSuperAdmin && !hasPerm) {
      throw new Error(`Forbidden: You do not have permission to perform this action (${requiredPermission})`);
    }
  }

  return currentUser;
}

export async function getCurrentAdminUser() {
  try {
    return await verifyAdmin();
  } catch (err) {
    return null;
  }
}

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username and password are required' };
  }

  const user = getUserByUsername(username);
  if (!user) {
    return { error: 'Invalid username or password' };
  }

  const hashed = hashPassword(password);
  if (user.passwordHash !== hashed) {
    return { error: 'Invalid username or password' };
  }

  const token = createSessionForUser(user.id);
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

// User Management Actions (Requires 'manage_users' permission)
export async function getUsersAction() {
  try {
    await verifyAdmin('manage_users');
    return { success: true, users: getUsers() };
  } catch (error: any) {
    return { error: error.message || 'Unauthorized' };
  }
}

export async function createUserAction(data: { username: string; password: string; name: string; role: AdminRole; permissions: AdminPermission[] }) {
  try {
    await verifyAdmin('manage_users');
    
    if (!data.username || !data.password || !data.name || !data.role) {
      return { error: 'Username, password, name, and role are required' };
    }

    const newUser = addUser(data);
    revalidatePath('/admin-panel');
    return { success: true, user: newUser };
  } catch (error: any) {
    return { error: error.message || 'Failed to create admin user' };
  }
}

export async function editUserAction(id: string, data: { name?: string; role?: AdminRole; permissions?: AdminPermission[]; password?: string }) {
  try {
    await verifyAdmin('manage_users');
    
    const updated = updateUser(id, data);
    if (!updated) return { error: 'User account not found' };

    revalidatePath('/admin-panel');
    return { success: true, user: updated };
  } catch (error: any) {
    return { error: error.message || 'Failed to update admin user' };
  }
}

export async function deleteUserAction(id: string) {
  try {
    const currentUser = await verifyAdmin('manage_users');
    
    if (currentUser.id === id) {
      return { error: 'You cannot delete your own active admin account.' };
    }

    const deleted = deleteUser(id);
    if (!deleted) return { error: 'User not found or cannot be deleted' };

    revalidatePath('/admin-panel');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to delete user' };
  }
}

// Portfolio Actions (RBAC Scoped)
export async function addPortfolioAction(data: { title: string; category: string; image: string }) {
  try {
    await verifyAdmin('create_content');
    if (!data.title || !data.category || !data.image) {
      return { error: 'All fields are required' };
    }
    const newItem = addPortfolioItem(data);
    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath('/api/portfolio');
    return { success: true, item: newItem };
  } catch (error: any) {
    return { error: error.message || 'Unauthorized' };
  }
}

export async function editPortfolioAction(id: number, data: { title: string; category: string; image: string }) {
  try {
    await verifyAdmin('edit_content');
    const updated = updatePortfolioItem(id, data);
    if (!updated) return { error: 'Item not found' };
    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath('/api/portfolio');
    return { success: true, item: updated };
  } catch (error: any) {
    return { error: error.message || 'Unauthorized' };
  }
}

export async function deletePortfolioAction(id: number) {
  try {
    await verifyAdmin('delete_content');
    const deleted = deletePortfolioItem(id);
    if (!deleted) return { error: 'Item not found' };
    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath('/api/portfolio');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Unauthorized' };
  }
}

// Shop Actions (RBAC Scoped)
export async function addShopAction(data: { title: string; price: number; image: string; size: string }) {
  try {
    await verifyAdmin('create_content');
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
    await verifyAdmin('edit_content');
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
    await verifyAdmin('delete_content');
    const deleted = deleteShopItem(id);
    if (!deleted) return { error: 'Item not found' };
    revalidatePath('/shop');
    revalidatePath('/api/shop');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Unauthorized' };
  }
}

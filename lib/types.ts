// Permission & Role Types for RBAC System
export type AdminPermission = 
  | 'manage_users' 
  | 'create_content' 
  | 'edit_content' 
  | 'delete_content' 
  | 'view_analytics';

export type AdminRole = 'super_admin' | 'manager' | 'editor' | 'viewer' | 'custom';

export const ALL_PERMISSIONS: { id: AdminPermission; label: string; description: string }[] = [
  { id: 'manage_users', label: 'Manage Admin Users', description: 'Create, edit, delete admin accounts & assign roles' },
  { id: 'create_content', label: 'Create Content', description: 'Add new portfolio pieces & shop products' },
  { id: 'edit_content', label: 'Edit Content', description: 'Modify existing portfolio pieces & shop products' },
  { id: 'delete_content', label: 'Delete Content', description: 'Remove portfolio pieces & shop products' },
  { id: 'view_analytics', label: 'View Analytics & Stats', description: 'Access control center stats & financial metrics' }
];

export const ROLE_PRESETS: Record<AdminRole, AdminPermission[]> = {
  super_admin: ['manage_users', 'create_content', 'edit_content', 'delete_content', 'view_analytics'],
  manager: ['create_content', 'edit_content', 'delete_content', 'view_analytics'],
  editor: ['create_content', 'edit_content', 'view_analytics'],
  viewer: ['view_analytics'],
  custom: []
};

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
  role: AdminRole;
  permissions: AdminPermission[];
  createdAt: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export interface ShopItem {
  id: number;
  title: string;
  price: number;
  image: string;
  size?: string;
}

export interface Session {
  token: string;
  userId: string;
  expiresAt: string;
}

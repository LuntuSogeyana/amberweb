import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  AdminPermission,
  AdminRole,
  ALL_PERMISSIONS,
  ROLE_PRESETS,
  User,
  PortfolioItem,
  ShopItem,
  Session
} from './types';

export * from './types';

const DB_PATH = path.join(process.cwd(), 'lib', 'db.json');

interface DatabaseSchema {
  portfolio: PortfolioItem[];
  shop: ShopItem[];
  sessions: Session[];
  users: User[];
}

// Password Hash Helper
export function hashPassword(password: string): string {
  const salt = 'amber_art_studio_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// Default mock data to initialize the DB with
const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  { id: 1, title: "Neon Dreams", category: "Digital", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" },
  { id: 2, title: "Charcoal Study", category: "Sketches", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, title: "Abstract Flow", category: "Abstract", image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1000&auto=format&fit=crop" },
];

const DEFAULT_SHOP: ShopItem[] = [
  { id: 101, title: "Neon Dreams Print", price: 45.00, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop", size: "A4" },
  { id: 102, title: "Original Charcoal", price: 250.00, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop", size: "A3" },
];

const DEFAULT_SUPER_ADMIN: User = {
  id: 'usr_super_admin',
  username: process.env.ADMIN_USERNAME || 'admin',
  passwordHash: hashPassword(process.env.ADMIN_PASSWORD || 'admin-secure-2026'),
  name: 'Primary Studio Admin',
  role: 'super_admin',
  permissions: ['manage_users', 'create_content', 'edit_content', 'delete_content', 'view_analytics'],
  createdAt: new Date().toISOString()
};

function readDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialData: DatabaseSchema = {
        portfolio: DEFAULT_PORTFOLIO,
        shop: DEFAULT_SHOP,
        sessions: [],
        users: [DEFAULT_SUPER_ADMIN]
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
      return initialData;
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const parsed: DatabaseSchema = JSON.parse(data);

    // Migration fallback for existing DBs without users table
    if (!parsed.users || parsed.users.length === 0) {
      parsed.users = [DEFAULT_SUPER_ADMIN];
      writeDB(parsed);
    }
    return parsed;
  } catch (error) {
    console.error("Failed to read database:", error);
    return { portfolio: DEFAULT_PORTFOLIO, shop: DEFAULT_SHOP, sessions: [], users: [DEFAULT_SUPER_ADMIN] };
  }
}

function writeDB(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Failed to write database:", error);
  }
}

// User Management API
export function getUsers(): Omit<User, 'passwordHash'>[] {
  const db = readDB();
  return db.users.map(({ passwordHash, ...user }) => user);
}

export function getUserById(id: string): User | null {
  const db = readDB();
  return db.users.find(u => u.id === id) || null;
}

export function getUserByUsername(username: string): User | null {
  const db = readDB();
  return db.users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}

export function addUser(data: { username: string; password: string; name: string; role: AdminRole; permissions: AdminPermission[] }): Omit<User, 'passwordHash'> {
  const db = readDB();
  
  if (db.users.some(u => u.username.toLowerCase() === data.username.toLowerCase())) {
    throw new Error(`Username "${data.username}" is already taken.`);
  }

  const newId = `usr_${crypto.randomBytes(6).toString('hex')}`;
  const newUser: User = {
    id: newId,
    username: data.username,
    passwordHash: hashPassword(data.password),
    name: data.name,
    role: data.role,
    permissions: data.permissions,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  const { passwordHash, ...safeUser } = newUser;
  return safeUser;
}

export function updateUser(id: string, updates: { name?: string; role?: AdminRole; permissions?: AdminPermission[]; password?: string }): Omit<User, 'passwordHash'> | null {
  const db = readDB();
  const index = db.users.findIndex(u => u.id === id);
  if (index === -1) return null;

  const current = db.users[index];
  const updatedUser: User = {
    ...current,
    name: updates.name ?? current.name,
    role: updates.role ?? current.role,
    permissions: updates.permissions ?? current.permissions,
    passwordHash: updates.password ? hashPassword(updates.password) : current.passwordHash
  };

  db.users[index] = updatedUser;
  writeDB(db);

  const { passwordHash, ...safeUser } = updatedUser;
  return safeUser;
}

export function deleteUser(id: string): boolean {
  const db = readDB();
  
  // Protect super_admin deletion if it's the last super_admin
  const targetUser = db.users.find(u => u.id === id);
  if (!targetUser) return false;

  if (targetUser.role === 'super_admin') {
    const superAdminCount = db.users.filter(u => u.role === 'super_admin').length;
    if (superAdminCount <= 1) {
      throw new Error('Cannot delete the last Super Admin account.');
    }
  }

  db.users = db.users.filter(u => u.id !== id);
  // Also clean up any active sessions for deleted user
  db.sessions = db.sessions.filter(s => s.userId !== id);
  writeDB(db);
  return true;
}

// Portfolio API
export function getPortfolio(): PortfolioItem[] {
  return readDB().portfolio;
}

export function addPortfolioItem(item: Omit<PortfolioItem, 'id'>): PortfolioItem {
  const db = readDB();
  const nextId = db.portfolio.length > 0 ? Math.max(...db.portfolio.map(i => i.id)) + 1 : 1;
  const newItem = { ...item, id: nextId };
  db.portfolio.push(newItem);
  writeDB(db);
  return newItem;
}

export function updatePortfolioItem(id: number, itemUpdate: Partial<Omit<PortfolioItem, 'id'>>): PortfolioItem | null {
  const db = readDB();
  const index = db.portfolio.findIndex(i => i.id === id);
  if (index === -1) return null;
  
  db.portfolio[index] = { ...db.portfolio[index], ...itemUpdate };
  writeDB(db);
  return db.portfolio[index];
}

export function deletePortfolioItem(id: number): boolean {
  const db = readDB();
  const originalLength = db.portfolio.length;
  db.portfolio = db.portfolio.filter(i => i.id !== id);
  writeDB(db);
  return db.portfolio.length < originalLength;
}

// Shop API
export function getShop(): ShopItem[] {
  return readDB().shop;
}

export function addShopItem(item: Omit<ShopItem, 'id'>): ShopItem {
  const db = readDB();
  const nextId = db.shop.length > 0 ? Math.max(...db.shop.map(i => i.id)) + 1 : 101;
  const newItem = { ...item, id: nextId };
  db.shop.push(newItem);
  writeDB(db);
  return newItem;
}

export function updateShopItem(id: number, itemUpdate: Partial<Omit<ShopItem, 'id'>>): ShopItem | null {
  const db = readDB();
  const index = db.shop.findIndex(i => i.id === id);
  if (index === -1) return null;
  
  db.shop[index] = { ...db.shop[index], ...itemUpdate };
  writeDB(db);
  return db.shop[index];
}

export function deleteShopItem(id: number): boolean {
  const db = readDB();
  const originalLength = db.shop.length;
  db.shop = db.shop.filter(i => i.id !== id);
  writeDB(db);
  return db.shop.length < originalLength;
}

// Session API tied to Users
export function createSessionForUser(userId: string): string {
  const db = readDB();
  const token = crypto.randomBytes(32).toString('hex');
  const days = parseInt(process.env.SESSION_MAX_AGE_DAYS || '7', 10);
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  
  db.sessions = db.sessions.filter(s => new Date(s.expiresAt) > new Date());
  db.sessions.push({ token, userId, expiresAt });
  writeDB(db);
  return token;
}

export function getSessionUser(token: string): Omit<User, 'passwordHash'> | null {
  const db = readDB();
  const session = db.sessions.find(s => s.token === token);
  if (!session) return null;
  
  if (new Date(session.expiresAt) <= new Date()) {
    db.sessions = db.sessions.filter(s => s.token !== token);
    writeDB(db);
    return null;
  }

  const user = db.users.find(u => u.id === session.userId);
  if (!user) return null;

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function isValidSession(token: string): boolean {
  return getSessionUser(token) !== null;
}

export function deleteSession(token: string): void {
  const db = readDB();
  db.sessions = db.sessions.filter(s => s.token !== token);
  writeDB(db);
}

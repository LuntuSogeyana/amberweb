import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_PATH = path.join(process.cwd(), 'lib', 'db.json');

// Interface declarations
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
  expiresAt: string;
}

interface DatabaseSchema {
  portfolio: PortfolioItem[];
  shop: ShopItem[];
  sessions: Session[];
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

function readDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialData: DatabaseSchema = {
        portfolio: DEFAULT_PORTFOLIO,
        shop: DEFAULT_SHOP,
        sessions: []
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
      return initialData;
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read database:", error);
    return { portfolio: DEFAULT_PORTFOLIO, shop: DEFAULT_SHOP, sessions: [] };
  }
}

function writeDB(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Failed to write database:", error);
  }
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

// Session API
export function createSession(): string {
  const db = readDB();
  const token = crypto.randomBytes(32).toString('hex');
  const days = parseInt(process.env.SESSION_MAX_AGE_DAYS || '7', 10);
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  
  // Clean up expired sessions first
  db.sessions = db.sessions.filter(s => new Date(s.expiresAt) > new Date());
  
  db.sessions.push({ token, expiresAt });
  writeDB(db);
  return token;
}

export function isValidSession(token: string): boolean {
  const db = readDB();
  const session = db.sessions.find(s => s.token === token);
  if (!session) return false;
  
  const isValid = new Date(session.expiresAt) > new Date();
  if (!isValid) {
    // Clean up if expired
    db.sessions = db.sessions.filter(s => s.token !== token);
    writeDB(db);
  }
  return isValid;
}

export function deleteSession(token: string): void {
  const db = readDB();
  db.sessions = db.sessions.filter(s => s.token !== token);
  writeDB(db);
}

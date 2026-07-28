'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, LogOut, Grid, ShoppingBag, 
  Layers, DollarSign, X, Check,
  AlertCircle, LayoutDashboard, Users, Shield, Key, UserCheck, Lock
} from 'lucide-react';
import { 
  logoutAction, 
  addPortfolioAction, 
  editPortfolioAction, 
  deletePortfolioAction,
  addShopAction,
  editShopAction,
  deleteShopAction,
  createUserAction,
  editUserAction,
  deleteUserAction
} from '../app/actions/admin';
import { 
  ALL_PERMISSIONS, 
  ROLE_PRESETS,
  type PortfolioItem, 
  type ShopItem, 
  type User, 
  type AdminPermission, 
  type AdminRole 
} from '../lib/types';

interface AdminDashboardProps {
  currentUser: Omit<User, 'passwordHash'>;
  initialPortfolio: PortfolioItem[];
  initialShop: ShopItem[];
  initialUsers: Omit<User, 'passwordHash'>[];
}

export default function AdminDashboard({ 
  currentUser, 
  initialPortfolio, 
  initialShop,
  initialUsers 
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'portfolio' | 'shop' | 'users'>('stats');
  
  // Data States
  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>(initialPortfolio);
  const [shopList, setShopList] = useState<ShopItem[]>(initialShop);
  const [userList, setUserList] = useState<Omit<User, 'passwordHash'>[]>(initialUsers);

  // Helper permission check
  const hasPermission = (perm: AdminPermission) => {
    if (currentUser.role === 'super_admin') return true;
    return currentUser.permissions && currentUser.permissions.includes(perm);
  };

  // Modals / Form States - Portfolio & Shop
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [isAddingShop, setIsAddingShop] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);
  const [editingShop, setEditingShop] = useState<ShopItem | null>(null);

  // Form Fields - Portfolio
  const [portTitle, setPortTitle] = useState('');
  const [portCategory, setPortCategory] = useState('Digital');
  const [portImage, setPortImage] = useState('');

  // Form Fields - Shop
  const [shopTitle, setShopTitle] = useState('');
  const [shopPrice, setShopPrice] = useState('');
  const [shopImage, setShopImage] = useState('');
  const [shopSize, setShopSize] = useState('A4');

  // Modals / Form States - Users
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<Omit<User, 'passwordHash'> | null>(null);

  // Form Fields - Users
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('editor');
  const [newPermissions, setNewPermissions] = useState<AdminPermission[]>(ROLE_PRESETS.editor);

  // Edit User Form Fields
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<AdminRole>('editor');
  const [editPermissions, setEditPermissions] = useState<AdminPermission[]>([]);
  const [editPassword, setEditPassword] = useState('');

  // Async Pending State
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const triggerNotification = (success: string | null, error: string | null) => {
    if (success) {
      setSuccessMsg(success);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
    if (error) {
      setErrorMsg(error);
      setTimeout(() => setErrorMsg(null), 4000);
    }
  };

  // Preset Role Change Handler for New User
  const handleRolePresetChange = (role: AdminRole) => {
    setNewRole(role);
    if (role !== 'custom') {
      setNewPermissions(ROLE_PRESETS[role]);
    }
  };

  const toggleNewPermission = (perm: AdminPermission) => {
    setNewRole('custom');
    setNewPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  // Preset Role Change Handler for Edit User
  const handleEditRolePresetChange = (role: AdminRole) => {
    setEditRole(role);
    if (role !== 'custom') {
      setEditPermissions(ROLE_PRESETS[role]);
    }
  };

  const toggleEditPermission = (perm: AdminPermission) => {
    setEditRole('custom');
    setEditPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  // Handlers - User Management CRUD
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newUsername || !newPassword || !newName) {
      triggerNotification(null, 'Username, password, and name are required');
      return;
    }

    startTransition(async () => {
      const res = await createUserAction({
        username: newUsername,
        password: newPassword,
        name: newName,
        role: newRole,
        permissions: newPermissions
      });

      if (res.error) {
        triggerNotification(null, res.error);
      } else if (res.success && res.user) {
        setUserList(prev => [...prev, res.user as Omit<User, 'passwordHash'>]);
        setNewUsername('');
        setNewPassword('');
        setNewName('');
        setNewRole('editor');
        setNewPermissions(ROLE_PRESETS.editor);
        setIsAddingUser(false);
        triggerNotification('New admin user created successfully!', null);
      }
    });
  };

  const openEditUserModal = (user: Omit<User, 'passwordHash'>) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditRole(user.role);
    setEditPermissions(user.permissions || []);
    setEditPassword('');
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    startTransition(async () => {
      const res = await editUserAction(editingUser.id, {
        name: editName,
        role: editRole,
        permissions: editPermissions,
        password: editPassword.trim() !== '' ? editPassword : undefined
      });

      if (res.error) {
        triggerNotification(null, res.error);
      } else if (res.success && res.user) {
        setUserList(prev => prev.map(u => u.id === editingUser.id ? (res.user as Omit<User, 'passwordHash'>) : u));
        setEditingUser(null);
        triggerNotification('Admin user updated successfully!', null);
      }
    });
  };

  const handleDeleteUser = async (id: string, username: string) => {
    if (!confirm(`Are you sure you want to delete admin account "${username}"?`)) return;

    startTransition(async () => {
      const res = await deleteUserAction(id);
      if (res.error) {
        triggerNotification(null, res.error);
      } else {
        setUserList(prev => prev.filter(u => u.id !== id));
        triggerNotification(`Admin account "${username}" deleted successfully!`, null);
      }
    });
  };

  // Handlers - Portfolio CRUD
  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    
    if (!portTitle || !portCategory || !portImage) {
      triggerNotification(null, 'All fields are required');
      return;
    }

    startTransition(async () => {
      const res = await addPortfolioAction({
        title: portTitle,
        category: portCategory,
        image: portImage
      });

      if (res.error) {
        triggerNotification(null, res.error);
      } else if (res.success && res.item) {
        setPortfolioList(prev => [...prev, res.item as PortfolioItem]);
        setPortTitle('');
        setPortImage('');
        setIsAddingPortfolio(false);
        triggerNotification('Portfolio item added successfully!', null);
      }
    });
  };

  const handleEditPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPortfolio) return;

    startTransition(async () => {
      const res = await editPortfolioAction(editingPortfolio.id, {
        title: editingPortfolio.title,
        category: editingPortfolio.category,
        image: editingPortfolio.image
      });

      if (res.error) {
        triggerNotification(null, res.error);
      } else if (res.success && res.item) {
        setPortfolioList(prev => prev.map(item => item.id === editingPortfolio.id ? (res.item as PortfolioItem) : item));
        setEditingPortfolio(null);
        triggerNotification('Portfolio item updated successfully!', null);
      }
    });
  };

  const handleDeletePortfolio = async (id: number) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;
    
    startTransition(async () => {
      const res = await deletePortfolioAction(id);
      if (res.error) {
        triggerNotification(null, res.error);
      } else {
        setPortfolioList(prev => prev.filter(item => item.id !== id));
        triggerNotification('Portfolio item deleted successfully!', null);
      }
    });
  };

  // Handlers - Shop CRUD
  const handleAddShop = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    
    const priceNum = parseFloat(shopPrice);
    if (!shopTitle || isNaN(priceNum) || !shopImage) {
      triggerNotification(null, 'Valid title, price, and image URL are required');
      return;
    }

    startTransition(async () => {
      const res = await addShopAction({
        title: shopTitle,
        price: priceNum,
        image: shopImage,
        size: shopSize
      });

      if (res.error) {
        triggerNotification(null, res.error);
      } else if (res.success && res.item) {
        setShopList(prev => [...prev, res.item as ShopItem]);
        setShopTitle('');
        setShopPrice('');
        setShopImage('');
        setIsAddingShop(false);
        triggerNotification('Shop item added successfully!', null);
      }
    });
  };

  const handleEditShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShop) return;

    startTransition(async () => {
      const res = await editShopAction(editingShop.id, {
        title: editingShop.title,
        price: Number(editingShop.price),
        image: editingShop.image,
        size: editingShop.size || 'A4'
      });

      if (res.error) {
        triggerNotification(null, res.error);
      } else if (res.success && res.item) {
        setShopList(prev => prev.map(item => item.id === editingShop.id ? (res.item as ShopItem) : item));
        setEditingShop(null);
        triggerNotification('Shop item updated successfully!', null);
      }
    });
  };

  const handleDeleteShop = async (id: number) => {
    if (!confirm('Are you sure you want to delete this shop product?')) return;
    
    startTransition(async () => {
      const res = await deleteShopAction(id);
      if (res.error) {
        triggerNotification(null, res.error);
      } else {
        setShopList(prev => prev.filter(item => item.id !== id));
        triggerNotification('Shop item deleted successfully!', null);
      }
    });
  };

  return (
    <div className="relative space-y-8 animate-in fade-in duration-500 text-left">
      
      {/* Background Decorative Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-[#ffd6a5]/40 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-[#ff8a5b]/30 blur-3xl rounded-full" />
      </div>

      {/* Top Banner & Logged-In User RBAC Status */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-light text-neutral-900 dark:text-white tracking-tight">
              Control Center
            </h1>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={13} />
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
            Logged in as <strong className="text-neutral-900 dark:text-white">{currentUser.name}</strong> (@{currentUser.username})
          </p>
        </div>
        
        <button
          onClick={() => startTransition(async () => { await logoutAction(); })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-500/30 text-red-700 dark:text-red-400 bg-red-500/5 hover:bg-red-500/10 active:scale-95 transition-all text-xs font-bold uppercase tracking-wider self-start md:self-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          aria-label="Sign out of Admin Panel"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      {/* Active Permissions Bar */}
      <div className="relative z-10 flex flex-wrap items-center gap-2 bg-neutral-100 dark:bg-neutral-900/60 p-3 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 text-xs">
        <span className="text-neutral-500 font-semibold flex items-center gap-1 mr-2">
          <Key size={13} />
          Your Action Rights:
        </span>
        {ALL_PERMISSIONS.map(p => {
          const active = hasPermission(p.id);
          return (
            <span 
              key={p.id}
              className={`px-2.5 py-1 rounded-md font-semibold text-[11px] flex items-center gap-1 ${
                active 
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400" 
                  : "bg-neutral-200/50 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 line-through opacity-60"
              }`}
            >
              {active ? <Check size={12} /> : <Lock size={12} />}
              {p.label}
            </span>
          );
        })}
      </div>

      {/* Notifications Toast */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-6 py-3.5 rounded-full shadow-2xl backdrop-blur-md text-sm border border-neutral-800 dark:border-neutral-200 font-semibold"
            role="status"
          >
            <Check size={16} className="text-emerald-500" />
            {successMsg}
          </motion.div>
        )}
        
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-red-700 text-white px-6 py-3.5 rounded-full shadow-2xl backdrop-blur-md text-sm font-semibold border border-red-600"
            role="alert"
          >
            <AlertCircle size={16} />
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Tabs Bar */}
      <div className="relative z-10 flex flex-wrap gap-2 bg-neutral-200/60 dark:bg-neutral-900/60 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-inner">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex-1 justify-center cursor-pointer ${
            activeTab === 'stats'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-md'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
          role="tab"
        >
          <LayoutDashboard size={15} />
          Stats
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex-1 justify-center cursor-pointer ${
            activeTab === 'portfolio'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-md'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
          role="tab"
        >
          <Grid size={15} />
          Portfolio
        </button>

        <button
          onClick={() => setActiveTab('shop')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex-1 justify-center cursor-pointer ${
            activeTab === 'shop'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-md'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
          role="tab"
        >
          <ShoppingBag size={15} />
          Prints Shop
        </button>

        {hasPermission('manage_users') && (
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex-1 justify-center cursor-pointer ${
              activeTab === 'users'
                ? 'bg-amber-500 text-black font-extrabold shadow-md'
                : 'text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200'
            }`}
            role="tab"
          >
            <Users size={15} />
            User Management ({userList.length})
          </button>
        )}
      </div>

      {/* Main Tab Switch Content */}
      <AnimatePresence mode="wait">
        
        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <motion.div
            key="stats-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 p-6 rounded-3xl flex items-center gap-5 shadow-sm">
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Layers size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Portfolio Items</p>
                  <p className="text-3xl font-light text-neutral-900 dark:text-white mt-1">{portfolioList.length}</p>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 p-6 rounded-3xl flex items-center gap-5 shadow-sm">
                <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Print Catalog</p>
                  <p className="text-3xl font-light text-neutral-900 dark:text-white mt-1">{shopList.length}</p>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 p-6 rounded-3xl flex items-center gap-5 shadow-sm">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Catalog Valuation</p>
                  <p className="text-3xl font-light text-neutral-900 dark:text-white mt-1">
                    ${shopList.reduce((sum, item) => sum + item.price, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            {/* Configurable Roles Overview Card */}
            <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 p-8 rounded-3xl space-y-6 shadow-sm">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <UserCheck className="text-amber-500" />
                <span>Role-Based Access Control System</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white/40 dark:bg-neutral-950/40 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">Super Admin</span>
                  <p className="text-neutral-600 dark:text-neutral-400">Full system access: Manage users, create/edit/delete content, and view stats.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/40 dark:bg-neutral-950/40 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Manager</span>
                  <p className="text-neutral-600 dark:text-neutral-400">Full content control: Create, edit, and delete artwork & shop inventory.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/40 dark:bg-neutral-950/40 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Editor</span>
                  <p className="text-neutral-600 dark:text-neutral-400">Content creator: Create and edit artwork & prints (deletion disabled).</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/40 dark:bg-neutral-950/40 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">Custom Admin</span>
                  <p className="text-neutral-600 dark:text-neutral-400">Tailored permissions checkboxes assigned specifically per user.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PORTFOLIO TAB */}
        {activeTab === 'portfolio' && (
          <motion.div
            key="portfolio-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-light text-neutral-900 dark:text-white">Portfolio Inventory</h2>
              {hasPermission('create_content') && (
                <button
                  onClick={() => setIsAddingPortfolio(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  <Plus size={14} /> Add Piece
                </button>
              )}
            </div>

            {/* ADD PORTFOLIO MODAL */}
            <AnimatePresence>
              {isAddingPortfolio && hasPermission('create_content') && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl space-y-4 shadow-xl"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                      New Portfolio Piece
                    </h3>
                    <button onClick={() => setIsAddingPortfolio(false)} className="text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer">
                      <X size={18} />
                    </button>
                  </div>
                  <form onSubmit={handleAddPortfolio} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300">Title</label>
                      <input
                        type="text" required placeholder="e.g. Moonlight Shadows"
                        value={portTitle} onChange={e => setPortTitle(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-4 py-2 text-sm outline-none text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300">Category</label>
                      <select
                        value={portCategory} onChange={e => setPortCategory(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-4 py-2 text-sm outline-none text-neutral-900 dark:text-white cursor-pointer"
                      >
                        <option value="Digital">Digital</option>
                        <option value="Sketches">Sketches</option>
                        <option value="Abstract">Abstract</option>
                        <option value="Oil Paint">Oil Paint</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300">Image URL</label>
                      <input
                        type="text" required placeholder="https://images.unsplash.com/..."
                        value={portImage} onChange={e => setPortImage(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-4 py-2 text-sm outline-none text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-3 flex justify-end gap-2.5 pt-2">
                      <button type="button" onClick={() => setIsAddingPortfolio(false)} className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-400 text-xs font-bold uppercase">Cancel</button>
                      <button type="submit" disabled={isPending} className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold uppercase">Save Piece</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PORTFOLIO TABLE */}
            <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    <th className="py-4 px-6">Image</th>
                    <th className="py-4 px-6">Title</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-sm text-neutral-800 dark:text-neutral-200">
                  {portfolioList.map(item => (
                    <tr key={item.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                      <td className="py-3.5 px-6">
                        <div className="h-12 w-12 rounded-xl overflow-hidden bg-neutral-900">
                          <img src={item.image} alt="" className="object-cover h-full w-full" />
                        </div>
                      </td>
                      <td className="py-3.5 px-6 font-medium text-neutral-900 dark:text-white">
                        {editingPortfolio?.id === item.id ? (
                          <input
                            type="text" className="bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-md px-2 py-1 text-sm outline-none text-neutral-900 dark:text-white"
                            value={editingPortfolio.title} onChange={e => setEditingPortfolio({ ...editingPortfolio, title: e.target.value })}
                          />
                        ) : (
                          item.title
                        )}
                      </td>
                      <td className="py-3.5 px-6">
                        {editingPortfolio?.id === item.id ? (
                          <select
                            className="bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-md px-2 py-1 text-sm outline-none text-neutral-900 dark:text-white"
                            value={editingPortfolio.category} onChange={e => setEditingPortfolio({ ...editingPortfolio, category: e.target.value })}
                          >
                            <option value="Digital">Digital</option>
                            <option value="Sketches">Sketches</option>
                            <option value="Abstract">Abstract</option>
                            <option value="Oil Paint">Oil Paint</option>
                          </select>
                        ) : (
                          <span className="px-2.5 py-1 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold">
                            {item.category}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex justify-end gap-3">
                          {editingPortfolio?.id === item.id ? (
                            <>
                              <button onClick={handleEditPortfolio} className="text-emerald-600 p-1"><Check size={18} /></button>
                              <button onClick={() => setEditingPortfolio(null)} className="text-neutral-500 p-1"><X size={18} /></button>
                            </>
                          ) : (
                            <>
                              {hasPermission('edit_content') && (
                                <button onClick={() => setEditingPortfolio({ ...item })} className="text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 p-1.5"><Edit2 size={16} /></button>
                              )}
                              {hasPermission('delete_content') && (
                                <button onClick={() => handleDeletePortfolio(item.id)} className="text-neutral-600 dark:text-neutral-300 hover:text-red-600 p-1.5"><Trash2 size={16} /></button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* PRINTS SHOP TAB */}
        {activeTab === 'shop' && (
          <motion.div
            key="shop-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-light text-neutral-900 dark:text-white">Prints Shop Catalog</h2>
              {hasPermission('create_content') && (
                <button
                  onClick={() => setIsAddingShop(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  <Plus size={14} /> Add Product
                </button>
              )}
            </div>

            {/* ADD SHOP MODAL */}
            <AnimatePresence>
              {isAddingShop && hasPermission('create_content') && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl space-y-4 shadow-xl"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                      New Shop Product
                    </h3>
                    <button onClick={() => setIsAddingShop(false)} className="text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer">
                      <X size={18} />
                    </button>
                  </div>
                  <form onSubmit={handleAddShop} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300">Title</label>
                      <input
                        type="text" required placeholder="e.g. Neon Print"
                        value={shopTitle} onChange={e => setShopTitle(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-4 py-2 text-sm outline-none text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300">Price ($)</label>
                      <input
                        type="number" step="0.01" required placeholder="45.00"
                        value={shopPrice} onChange={e => setShopPrice(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-4 py-2 text-sm outline-none text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300">Size</label>
                      <select
                        value={shopSize} onChange={e => setShopSize(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-4 py-2 text-sm outline-none text-neutral-900 dark:text-white cursor-pointer"
                      >
                        <option value="A4">A4 Print</option>
                        <option value="A3">A3 Original</option>
                        <option value="A2">A2 Poster</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300">Image URL</label>
                      <input
                        type="text" required placeholder="https://images.unsplash.com/..."
                        value={shopImage} onChange={e => setShopImage(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-4 py-2 text-sm outline-none text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-4 flex justify-end gap-2.5 pt-2">
                      <button type="button" onClick={() => setIsAddingShop(false)} className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-400 text-xs font-bold uppercase">Cancel</button>
                      <button type="submit" disabled={isPending} className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold uppercase">Save Product</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SHOP TABLE */}
            <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    <th className="py-4 px-6">Image</th>
                    <th className="py-4 px-6">Title</th>
                    <th className="py-4 px-6">Size</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-sm text-neutral-800 dark:text-neutral-200">
                  {shopList.map(item => (
                    <tr key={item.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                      <td className="py-3.5 px-6">
                        <div className="h-12 w-12 rounded-xl overflow-hidden bg-neutral-900">
                          <img src={item.image} alt="" className="object-cover h-full w-full" />
                        </div>
                      </td>
                      <td className="py-3.5 px-6 font-medium text-neutral-900 dark:text-white">
                        {editingShop?.id === item.id ? (
                          <input
                            type="text" className="bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-md px-2 py-1 text-sm outline-none text-neutral-900 dark:text-white"
                            value={editingShop.title} onChange={e => setEditingShop({ ...editingShop, title: e.target.value })}
                          />
                        ) : (
                          item.title
                        )}
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="px-2.5 py-1 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 font-semibold">
                          {item.size || 'A4'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-neutral-900 dark:text-white">
                        {editingShop?.id === item.id ? (
                          <input
                            type="number" step="0.01" className="bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-md px-2 py-1 text-sm outline-none text-neutral-900 dark:text-white w-24"
                            value={editingShop.price} onChange={e => setEditingShop({ ...editingShop, price: parseFloat(e.target.value) || 0 })}
                          />
                        ) : (
                          `$${item.price.toFixed(2)}`
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex justify-end gap-3">
                          {editingShop?.id === item.id ? (
                            <>
                              <button onClick={handleEditShop} className="text-emerald-600 p-1"><Check size={18} /></button>
                              <button onClick={() => setEditingShop(null)} className="text-neutral-500 p-1"><X size={18} /></button>
                            </>
                          ) : (
                            <>
                              {hasPermission('edit_content') && (
                                <button onClick={() => setEditingShop({ ...item })} className="text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 p-1.5"><Edit2 size={16} /></button>
                              )}
                              {hasPermission('delete_content') && (
                                <button onClick={() => handleDeleteShop(item.id)} className="text-neutral-600 dark:text-neutral-300 hover:text-red-600 p-1.5"><Trash2 size={16} /></button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* USER MANAGEMENT TAB (RBAC Scoped) */}
        {activeTab === 'users' && hasPermission('manage_users') && (
          <motion.div
            key="users-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-light text-neutral-900 dark:text-white">Admin Users & Configurable Roles</h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Create accounts, set role presets, or manually configure granular action permissions.</p>
              </div>

              <button
                onClick={() => setIsAddingUser(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold hover:bg-amber-400 transition-all text-xs uppercase tracking-wider cursor-pointer shadow-sm"
              >
                <Plus size={15} /> Create Admin Account
              </button>
            </div>

            {/* CREATE NEW ADMIN USER MODAL */}
            <AnimatePresence>
              {isAddingUser && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl space-y-6 shadow-2xl"
                >
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-white flex items-center gap-2">
                      <Users size={16} className="text-amber-500" />
                      <span>Create New Admin Account</span>
                    </h3>
                    <button onClick={() => setIsAddingUser(false)} className="text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer">
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleCreateUser} className="space-y-6">
                    {/* User Info Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300">Username</label>
                        <input
                          type="text" required placeholder="e.g. sarah_editor"
                          value={newUsername} onChange={e => setNewUsername(e.target.value)}
                          className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-4 py-2 text-sm outline-none text-neutral-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300">Full Name</label>
                        <input
                          type="text" required placeholder="e.g. Sarah Jenkins"
                          value={newName} onChange={e => setNewName(e.target.value)}
                          className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-4 py-2 text-sm outline-none text-neutral-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300">Password</label>
                        <input
                          type="password" required placeholder="••••••••"
                          value={newPassword} onChange={e => setNewPassword(e.target.value)}
                          className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-4 py-2 text-sm outline-none text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Role Preset Selector */}
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300">Role Preset</label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {(['super_admin', 'manager', 'editor', 'viewer', 'custom'] as AdminRole[]).map(role => (
                          <button
                            key={role} type="button"
                            onClick={() => handleRolePresetChange(role)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                              newRole === role 
                                ? "bg-amber-500 text-black border-amber-500 shadow-sm" 
                                : "bg-neutral-100 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-amber-500"
                            }`}
                          >
                            {role.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Configurable Granular Permissions Checkboxes */}
                    <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                      <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                        <span>Configurable Granular Permissions</span>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">Check or uncheck individual rights below</span>
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ALL_PERMISSIONS.map(perm => {
                          const checked = newPermissions.includes(perm.id);
                          return (
                            <label 
                              key={perm.id} 
                              onClick={() => toggleNewPermission(perm.id)}
                              className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                                checked 
                                  ? "bg-amber-500/10 border-amber-500/40 text-neutral-900 dark:text-white" 
                                  : "bg-neutral-50 dark:bg-neutral-950/50 border-neutral-200 dark:border-neutral-800 text-neutral-500"
                              }`}
                            >
                              <input 
                                type="checkbox" checked={checked} onChange={() => {}} 
                                className="mt-0.5 rounded accent-amber-500 cursor-pointer" 
                              />
                              <div className="space-y-0.5">
                                <span className="font-bold text-xs block">{perm.label}</span>
                                <span className="text-[11px] opacity-80 block">{perm.description}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setIsAddingUser(false)} className="px-5 py-2.5 rounded-xl text-neutral-600 dark:text-neutral-400 text-xs font-bold uppercase">Cancel</button>
                      <button type="submit" disabled={isPending} className="px-6 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-extrabold uppercase shadow-md">Create Account</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* EDIT ADMIN USER MODAL */}
            <AnimatePresence>
              {editingUser && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl space-y-6 shadow-2xl"
                >
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 dark:text-white flex items-center gap-2">
                      <Edit2 size={16} className="text-amber-500" />
                      <span>Edit Account & Permissions (@{editingUser.username})</span>
                    </h3>
                    <button onClick={() => setEditingUser(null)} className="text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer">
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleUpdateUser} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300">Full Name</label>
                        <input
                          type="text" required
                          value={editName} onChange={e => setEditName(e.target.value)}
                          className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-4 py-2 text-sm outline-none text-neutral-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300">Reset Password (Optional)</label>
                        <input
                          type="password" placeholder="Leave blank to keep current"
                          value={editPassword} onChange={e => setEditPassword(e.target.value)}
                          className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-4 py-2 text-sm outline-none text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Role Presets for Edit */}
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300">Role Preset</label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {(['super_admin', 'manager', 'editor', 'viewer', 'custom'] as AdminRole[]).map(role => (
                          <button
                            key={role} type="button"
                            onClick={() => handleEditRolePresetChange(role)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                              editRole === role 
                                ? "bg-amber-500 text-black border-amber-500 shadow-sm" 
                                : "bg-neutral-100 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-amber-500"
                            }`}
                          >
                            {role.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Configurable Permissions for Edit */}
                    <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                      <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-700 dark:text-neutral-300">
                        Assigned Action Permissions
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ALL_PERMISSIONS.map(perm => {
                          const checked = editPermissions.includes(perm.id);
                          return (
                            <label 
                              key={perm.id} 
                              onClick={() => toggleEditPermission(perm.id)}
                              className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                                checked 
                                  ? "bg-amber-500/10 border-amber-500/40 text-neutral-900 dark:text-white" 
                                  : "bg-neutral-50 dark:bg-neutral-950/50 border-neutral-200 dark:border-neutral-800 text-neutral-500"
                              }`}
                            >
                              <input 
                                type="checkbox" checked={checked} onChange={() => {}} 
                                className="mt-0.5 rounded accent-amber-500 cursor-pointer" 
                              />
                              <div className="space-y-0.5">
                                <span className="font-bold text-xs block">{perm.label}</span>
                                <span className="text-[11px] opacity-80 block">{perm.description}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setEditingUser(null)} className="px-5 py-2.5 rounded-xl text-neutral-600 dark:text-neutral-400 text-xs font-bold uppercase">Cancel</button>
                      <button type="submit" disabled={isPending} className="px-6 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-extrabold uppercase shadow-md">Update User Rights</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* USERS TABLE */}
            <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    <th className="py-4 px-6">User / Account</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Configured Action Permissions</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-sm text-neutral-800 dark:text-neutral-200">
                  {userList.map(user => (
                    <tr key={user.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-extrabold flex items-center justify-center text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-neutral-900 dark:text-white leading-none">{user.name}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">@{user.username}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          user.role === 'super_admin'
                            ? "bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300"
                            : user.role === 'manager'
                            ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300"
                            : user.role === 'editor'
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                            : "bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300"
                        }`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          {user.role === 'super_admin' ? (
                            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">✦ All Permissions (Super Admin)</span>
                          ) : user.permissions && user.permissions.length > 0 ? (
                            user.permissions.map(p => (
                              <span key={p} className="px-2 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-bold">
                                {p.replace('_', ' ')}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-neutral-400 italic">No action permissions assigned</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditUserModal(user)}
                            className="flex items-center gap-1 text-xs text-indigo-700 dark:text-indigo-400 hover:bg-indigo-500/10 font-bold uppercase py-1.5 px-3 rounded-lg transition-all"
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          
                          {currentUser.id !== user.id && (
                            <button
                              onClick={() => handleDeleteUser(user.id, user.username)}
                              className="flex items-center gap-1 text-xs text-red-700 dark:text-red-400 hover:bg-red-500/10 font-bold uppercase py-1.5 px-3 rounded-lg transition-all"
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}

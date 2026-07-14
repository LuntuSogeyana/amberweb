'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, LogOut, Grid, ShoppingBag, 
  Layers, DollarSign, X, Check,
  AlertCircle, LayoutDashboard
} from 'lucide-react';
import { 
  logoutAction, 
  addPortfolioAction, 
  editPortfolioAction, 
  deletePortfolioAction,
  addShopAction,
  editShopAction,
  deleteShopAction
} from '../app/actions/admin';
import type { PortfolioItem, ShopItem } from '../lib/db';

interface AdminDashboardProps {
  initialPortfolio: PortfolioItem[];
  initialShop: ShopItem[];
}

export default function AdminDashboard({ initialPortfolio, initialShop }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'portfolio' | 'shop'>('stats');
  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>(initialPortfolio);
  const [shopList, setShopList] = useState<ShopItem[]>(initialShop);
  
  // Modals / Form States
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
    <div className="relative space-y-8 animate-in fade-in duration-500">
      
      {/* Background Decorative Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-[#ffd6a5]/40 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-[#ff8a5b]/30 blur-3xl rounded-full" />
      </div>

      {/* Top Banner / Actions */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <h1 className="text-4xl font-light text-neutral-850 dark:text-neutral-50 tracking-tight">
            Control Center
          </h1>
          <p className="text-neutral-655 dark:text-neutral-350 text-sm mt-1 font-medium">
            Manage your art pieces, print shop inventory, and view gallery analytics.
          </p>
        </div>
        
        <button
          onClick={() => startTransition(async () => { await logoutAction(); })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-500/30 text-red-750 dark:text-red-400 bg-red-500/5 hover:bg-red-500/10 active:scale-95 transition-all text-sm font-semibold self-start sm:self-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
          aria-label="Sign out of Admin Panel"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      {/* Notifications Toast */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-955 px-6 py-3.5 rounded-full shadow-2xl backdrop-blur-md text-sm border border-neutral-850 dark:border-neutral-100 font-semibold"
            role="status"
            aria-live="polite"
          >
            <Check size={16} className="text-green-500" />
            {successMsg}
          </motion.div>
        )}
        
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-red-750 text-white px-6 py-3.5 rounded-full shadow-2xl backdrop-blur-md text-sm font-semibold border border-red-650"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle size={16} />
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Tabs Container */}
      <div className="relative z-10 flex gap-2 bg-neutral-150 dark:bg-neutral-900/60 p-1.5 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/85 max-w-md shadow-inner">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex-1 justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 ${
            activeTab === 'stats'
              ? 'bg-white dark:bg-neutral-800 text-neutral-850 dark:text-white shadow-md'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-250'
          }`}
          aria-selected={activeTab === 'stats'}
          role="tab"
        >
          <LayoutDashboard size={14} />
          Stats
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex-1 justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 ${
            activeTab === 'portfolio'
              ? 'bg-white dark:bg-neutral-800 text-neutral-850 dark:text-white shadow-md'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-250'
          }`}
          aria-selected={activeTab === 'portfolio'}
          role="tab"
        >
          <Grid size={14} />
          Portfolio
        </button>
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex-1 justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 ${
            activeTab === 'shop'
              ? 'bg-white dark:bg-neutral-800 text-neutral-850 dark:text-white shadow-md'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-250'
          }`}
          aria-selected={activeTab === 'shop'}
          role="tab"
        >
          <ShoppingBag size={14} />
          Prints Shop
        </button>
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
            className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Stats Card 1 */}
            <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-800/80 p-6 rounded-3xl flex items-center gap-5 shadow-sm hover:scale-[1.01] hover:shadow-md transition-all">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-750 dark:text-indigo-450 flex items-center justify-center shrink-0">
                <Layers size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Portfolio Items</p>
                <p className="text-3xl font-light text-neutral-850 dark:text-neutral-50 mt-1">{portfolioList.length}</p>
              </div>
            </div>

            {/* Stats Card 2 */}
            <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-800/80 p-6 rounded-3xl flex items-center gap-5 shadow-sm hover:scale-[1.01] hover:shadow-md transition-all">
              <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-450 flex items-center justify-center shrink-0">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Shop Items</p>
                <p className="text-3xl font-light text-neutral-850 dark:text-neutral-50 mt-1">{shopList.length}</p>
              </div>
            </div>

            {/* Stats Card 3 */}
            <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-800/80 p-6 rounded-3xl flex items-center gap-5 shadow-sm hover:scale-[1.01] hover:shadow-md transition-all">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-450 flex items-center justify-center shrink-0">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Inventory Value</p>
                <p className="text-3xl font-light text-neutral-850 dark:text-neutral-50 mt-1">
                  ${shopList.reduce((sum, item) => sum + item.price, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Large Activity/Dashboard Panel */}
            <div className="col-span-1 md:col-span-3 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-800/80 p-8 rounded-3xl space-y-6 shadow-sm">
              <h3 className="text-xl font-semibold text-neutral-850 dark:text-neutral-50">Quick Tour & Access Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-neutral-700 dark:text-neutral-350">
                <div className="space-y-3">
                  <h4 className="font-bold text-neutral-900 dark:text-neutral-100">How to modify values:</h4>
                  <ul className="list-disc pl-4 space-y-2 leading-relaxed">
                    <li>Use the tabs above to toggle between the <strong>Portfolio</strong> and <strong>Shop/Prints</strong> sections.</li>
                    <li>Add new pieces by clicking the <span className="underline font-semibold text-indigo-700 dark:text-indigo-400">Add New</span> buttons.</li>
                    <li>Instantly edit or delete existing rows. Deletions will request a safety confirmation.</li>
                    <li>Changes are written server-side to <code className="bg-neutral-200/60 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-xs font-mono text-neutral-850 dark:text-neutral-200">db.json</code>.</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-neutral-900 dark:text-neutral-100">Security Gate:</h4>
                  <ul className="list-disc pl-4 space-y-2 leading-relaxed">
                    <li>This Control Center uses a cryptographically random session cookie.</li>
                    <li>If you log out, the session is invalidated immediately on the server.</li>
                    <li>Unauthenticated requests to <code className="bg-neutral-200/60 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-xs font-mono text-neutral-850 dark:text-neutral-200">/admin-panel</code> receive a clean 404 (Not Found), hiding the route from scanners.</li>
                  </ul>
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
              <h2 className="text-2xl font-light text-neutral-855 dark:text-neutral-100">Portfolio Inventory</h2>
              <button
                onClick={() => setIsAddingPortfolio(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 shadow-sm"
                aria-haspopup="dialog"
                aria-expanded={isAddingPortfolio}
              >
                <Plus size={14} /> Add Piece
              </button>
            </div>

            {/* ADD PORTFOLIO MODAL FORM */}
            <AnimatePresence>
              {isAddingPortfolio && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-250 dark:border-neutral-800 p-6 rounded-3xl space-y-4 shadow-lg"
                  role="dialog"
                  aria-labelledby="portfolio-modal-title"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 id="portfolio-modal-title" className="text-xs font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                      New Portfolio Piece
                    </h3>
                    <button 
                      onClick={() => setIsAddingPortfolio(false)} 
                      className="text-neutral-500 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-white cursor-pointer rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      aria-label="Close add form"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <form onSubmit={handleAddPortfolio} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="port-title-input" className="text-[10px] uppercase font-bold tracking-wider text-neutral-750 dark:text-neutral-300 pl-1">Title</label>
                      <input
                        id="port-title-input"
                        type="text"
                        required
                        placeholder="e.g. Moonlight Shadows"
                        value={portTitle}
                        onChange={e => setPortTitle(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-955 border border-neutral-350 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-sm outline-none focus-visible:border-indigo-650 dark:focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-600/20 dark:focus-visible:ring-indigo-400/20 text-neutral-900 dark:text-neutral-100 transition-all placeholder:text-neutral-450 dark:placeholder:text-neutral-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="port-category-select" className="text-[10px] uppercase font-bold tracking-wider text-neutral-750 dark:text-neutral-300 pl-1">Category</label>
                      <select
                        id="port-category-select"
                        value={portCategory}
                        onChange={e => setPortCategory(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-955 border border-neutral-350 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-sm outline-none focus-visible:border-indigo-650 dark:focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-600/20 dark:focus-visible:ring-indigo-400/20 text-neutral-900 dark:text-neutral-100 transition-all cursor-pointer"
                      >
                        <option value="Digital">Digital</option>
                        <option value="Sketches">Sketches</option>
                        <option value="Abstract">Abstract</option>
                        <option value="Oil Paint">Oil Paint</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="port-image-input" className="text-[10px] uppercase font-bold tracking-wider text-neutral-750 dark:text-neutral-300 pl-1">Image URL</label>
                      <input
                        id="port-image-input"
                        type="text"
                        required
                        placeholder="https://images.unsplash.com/..."
                        value={portImage}
                        onChange={e => setPortImage(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-955 border border-neutral-350 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-sm outline-none focus-visible:border-indigo-650 dark:focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-600/20 dark:focus-visible:ring-indigo-400/20 text-neutral-900 dark:text-neutral-100 transition-all placeholder:text-neutral-450 dark:placeholder:text-neutral-400"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-3 flex justify-end gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingPortfolio(false)}
                        className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isPending}
                        className="px-6 py-2 rounded-xl bg-indigo-650 text-white hover:bg-indigo-700 text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                      >
                        Save Piece
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PORTFOLIO GRID/TABLE CONTAINER */}
            <div className="bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-250 dark:border-neutral-800/80 rounded-3xl overflow-hidden shadow-sm">
              
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse text-left" aria-label="Portfolio Items">
                  <thead>
                    <tr className="border-b border-neutral-250 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                      <th scope="col" className="py-4 px-6">Image</th>
                      <th scope="col" className="py-4 px-6">Title</th>
                      <th scope="col" className="py-4 px-6">Category</th>
                      <th scope="col" className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-800/60 text-sm text-neutral-750 dark:text-neutral-300">
                    {portfolioList.map(item => (
                      <tr key={item.id} className="hover:bg-neutral-50/20 dark:hover:bg-neutral-900/10 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="h-12 w-12 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200/10">
                            <img src={item.image} alt="" className="object-cover h-full w-full" />
                          </div>
                        </td>
                        <td className="py-3.5 px-6 font-medium text-neutral-900 dark:text-neutral-100">
                          {editingPortfolio?.id === item.id ? (
                            <input
                              type="text"
                              aria-label="Edit title"
                              className="bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-md px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-indigo-600 outline-none text-neutral-900 dark:text-neutral-100"
                              value={editingPortfolio.title}
                              onChange={e => setEditingPortfolio({ ...editingPortfolio, title: e.target.value })}
                            />
                          ) : (
                            item.title
                          )}
                        </td>
                        <td className="py-3.5 px-6">
                          {editingPortfolio?.id === item.id ? (
                            <select
                              aria-label="Edit category"
                              className="bg-white dark:bg-neutral-955 border border-neutral-300 dark:border-neutral-800 rounded-md px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-indigo-600 outline-none text-neutral-900 dark:text-neutral-100 cursor-pointer"
                              value={editingPortfolio.category}
                              onChange={e => setEditingPortfolio({ ...editingPortfolio, category: e.target.value })}
                            >
                              <option value="Digital">Digital</option>
                              <option value="Sketches">Sketches</option>
                              <option value="Abstract">Abstract</option>
                              <option value="Oil Paint">Oil Paint</option>
                            </select>
                          ) : (
                            <span className="px-2.5 py-1 text-xs rounded-full bg-neutral-150 dark:bg-neutral-800 text-neutral-750 dark:text-neutral-300 font-semibold border border-neutral-200/40 dark:border-neutral-700/50">
                              {item.category}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <div className="flex justify-end gap-3">
                            {editingPortfolio?.id === item.id ? (
                              <>
                                <button
                                  onClick={handleEditPortfolio}
                                  className="text-emerald-600 hover:text-emerald-700 p-1 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                  aria-label={`Save changes to ${item.title}`}
                                >
                                  <Check size={18} />
                                </button>
                                <button
                                  onClick={() => setEditingPortfolio(null)}
                                  className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white p-1 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                  aria-label={`Cancel editing ${item.title}`}
                                >
                                  <X size={18} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => setEditingPortfolio({ ...item })}
                                  className="text-neutral-600 dark:text-neutral-300 hover:text-indigo-650 dark:hover:text-indigo-400 p-1.5 hover:bg-indigo-500/5 rounded-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                                  aria-label={`Edit item: ${item.title}`}
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeletePortfolio(item.id)}
                                  className="text-neutral-600 dark:text-neutral-300 hover:text-red-750 dark:hover:text-red-400 p-1.5 hover:bg-red-500/5 rounded-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                  aria-label={`Delete item: ${item.title}`}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-neutral-250 dark:divide-neutral-800/80 p-4 space-y-4">
                {portfolioList.map(item => (
                  <div key={item.id} className="pt-4 first:pt-0 flex flex-col gap-3">
                    <div className="flex gap-4 items-center">
                      <div className="h-14 w-14 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200/10 shrink-0">
                        <img src={item.image} alt="" className="object-cover h-full w-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {editingPortfolio?.id === item.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              aria-label="Edit title"
                              className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-md px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-indigo-650 outline-none text-neutral-900 dark:text-neutral-100"
                              value={editingPortfolio.title}
                              onChange={e => setEditingPortfolio({ ...editingPortfolio, title: e.target.value })}
                            />
                            <select
                              aria-label="Edit category"
                              className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-md px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-indigo-650 outline-none text-neutral-900 dark:text-neutral-100 cursor-pointer"
                              value={editingPortfolio.category}
                              onChange={e => setEditingPortfolio({ ...editingPortfolio, category: e.target.value })}
                            >
                              <option value="Digital">Digital</option>
                              <option value="Sketches">Sketches</option>
                              <option value="Abstract">Abstract</option>
                              <option value="Oil Paint">Oil Paint</option>
                            </select>
                          </div>
                        ) : (
                          <>
                            <h4 className="font-semibold text-neutral-850 dark:text-neutral-100 truncate">{item.title}</h4>
                            <span className="inline-block px-2.5 py-0.5 mt-1 text-[10px] uppercase font-bold tracking-wider rounded-md bg-neutral-150 dark:bg-neutral-800 text-neutral-750 dark:text-neutral-300">
                              {item.category}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions Row */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-neutral-150 dark:border-neutral-850">
                      {editingPortfolio?.id === item.id ? (
                        <>
                          <button
                            onClick={handleEditPortfolio}
                            className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 font-semibold uppercase tracking-wider py-1 px-3 bg-emerald-500/10 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                          >
                            <Check size={14} /> Save
                          </button>
                          <button
                            onClick={() => setEditingPortfolio(null)}
                            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-750 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-white font-semibold uppercase tracking-wider py-1 px-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
                          >
                            <X size={14} /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingPortfolio({ ...item })}
                            className="flex items-center gap-1 text-xs text-indigo-700 dark:text-indigo-400 hover:bg-indigo-500/10 font-semibold uppercase tracking-wider py-1.5 px-3 bg-indigo-500/5 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                            aria-label={`Edit: ${item.title}`}
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeletePortfolio(item.id)}
                            className="flex items-center gap-1 text-xs text-red-700 dark:text-red-400 hover:bg-red-500/10 font-semibold uppercase tracking-wider py-1.5 px-3 bg-red-500/5 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            aria-label={`Delete: ${item.title}`}
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SHOP TAB */}
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
              <h2 className="text-2xl font-light text-neutral-850 dark:text-neutral-105">Shop Catalog</h2>
              <button
                onClick={() => setIsAddingShop(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 shadow-sm"
                aria-haspopup="dialog"
                aria-expanded={isAddingShop}
              >
                <Plus size={14} /> Add Product
              </button>
            </div>

            {/* ADD SHOP MODAL FORM */}
            <AnimatePresence>
              {isAddingShop && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-250 dark:border-neutral-800 p-6 rounded-3xl space-y-4 shadow-lg"
                  role="dialog"
                  aria-labelledby="shop-modal-title"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 id="shop-modal-title" className="text-xs font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                      New Shop Product
                    </h3>
                    <button 
                      onClick={() => setIsAddingShop(false)} 
                      className="text-neutral-500 hover:text-neutral-850 dark:text-neutral-400 dark:hover:text-white cursor-pointer rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      aria-label="Close add form"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <form onSubmit={handleAddShop} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="shop-title-input" className="text-[10px] uppercase font-bold tracking-wider text-neutral-750 dark:text-neutral-300 pl-1">Title</label>
                      <input
                        id="shop-title-input"
                        type="text"
                        required
                        placeholder="e.g. Neon Print"
                        value={shopTitle}
                        onChange={e => setShopTitle(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-955 border border-neutral-350 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-sm outline-none focus-visible:border-indigo-650 dark:focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-600/20 dark:focus-visible:ring-indigo-400/20 text-neutral-900 dark:text-neutral-100 transition-all placeholder:text-neutral-450 dark:placeholder:text-neutral-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="shop-price-input" className="text-[10px] uppercase font-bold tracking-wider text-neutral-750 dark:text-neutral-300 pl-1">Price ($)</label>
                      <input
                        id="shop-price-input"
                        type="number"
                        required
                        step="0.01"
                        placeholder="45.00"
                        value={shopPrice}
                        onChange={e => setShopPrice(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-955 border border-neutral-355 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-sm outline-none focus-visible:border-indigo-655 dark:focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-600/20 dark:focus-visible:ring-indigo-400/20 text-neutral-900 dark:text-neutral-100 transition-all placeholder:text-neutral-450 dark:placeholder:text-neutral-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="shop-size-select" className="text-[10px] uppercase font-bold tracking-wider text-neutral-755 dark:text-neutral-300 pl-1">Size Option</label>
                      <select
                        id="shop-size-select"
                        value={shopSize}
                        onChange={e => setShopSize(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-955 border border-neutral-350 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-sm outline-none focus-visible:border-indigo-650 dark:focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-600/20 dark:focus-visible:ring-indigo-400/20 text-neutral-900 dark:text-neutral-100 transition-all cursor-pointer"
                      >
                        <option value="A4">A4 Print</option>
                        <option value="A3">A3 Original</option>
                        <option value="A2">A2 Poster</option>
                        <option value="A1">A1 Canvas</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="shop-image-input" className="text-[10px] uppercase font-bold tracking-wider text-neutral-750 dark:text-neutral-300 pl-1">Image URL</label>
                      <input
                        id="shop-image-input"
                        type="text"
                        required
                        placeholder="https://images.unsplash.com/..."
                        value={shopImage}
                        onChange={e => setShopImage(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-955 border border-neutral-350 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-sm outline-none focus-visible:border-indigo-650 dark:focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-600/20 dark:focus-visible:ring-indigo-400/20 text-neutral-900 dark:text-neutral-100 transition-all placeholder:text-neutral-450 dark:placeholder:text-neutral-400"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-4 flex justify-end gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingShop(false)}
                        className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isPending}
                        className="px-6 py-2 rounded-xl bg-indigo-650 text-white hover:bg-indigo-700 text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                      >
                        Save Product
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SHOP GRID/TABLE CONTAINER */}
            <div className="bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-250 dark:border-neutral-800/80 rounded-3xl overflow-hidden shadow-sm">
              
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse text-left" aria-label="Shop Catalog Items">
                  <thead>
                    <tr className="border-b border-neutral-250 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                      <th scope="col" className="py-4 px-6">Image</th>
                      <th scope="col" className="py-4 px-6">Product Title</th>
                      <th scope="col" className="py-4 px-6">Price</th>
                      <th scope="col" className="py-4 px-6">Size</th>
                      <th scope="col" className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-800/60 text-sm text-neutral-755 dark:text-neutral-300">
                    {shopList.map(item => (
                      <tr key={item.id} className="hover:bg-neutral-50/20 dark:hover:bg-neutral-900/10 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="h-12 w-12 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200/10">
                            <img src={item.image} alt="" className="object-cover h-full w-full" />
                          </div>
                        </td>
                        <td className="py-3.5 px-6 font-medium text-neutral-900 dark:text-neutral-100">
                          {editingShop?.id === item.id ? (
                            <input
                              type="text"
                              aria-label="Edit title"
                              className="bg-white dark:bg-neutral-950 border border-neutral-350 dark:border-neutral-800 rounded-md px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-indigo-650 outline-none text-neutral-900 dark:text-neutral-100"
                              value={editingShop.title}
                              onChange={e => setEditingShop({ ...editingShop, title: e.target.value })}
                            />
                          ) : (
                            item.title
                          )}
                        </td>
                        <td className="py-3.5 px-6 font-medium text-neutral-900 dark:text-neutral-100">
                          {editingShop?.id === item.id ? (
                            <div className="relative max-w-[100px]">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs font-bold">$</span>
                              <input
                                type="number"
                                step="0.01"
                                aria-label="Edit price"
                                className="w-full bg-white dark:bg-neutral-950 border border-neutral-355 dark:border-neutral-800 rounded-md pl-6 pr-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-indigo-650 outline-none text-neutral-900 dark:text-neutral-100"
                                value={editingShop.price}
                                onChange={e => setEditingShop({ ...editingShop, price: Number(e.target.value) })}
                              />
                            </div>
                          ) : (
                            <span className="font-bold text-neutral-800 dark:text-neutral-200">${item.price.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-6 text-neutral-850 dark:text-neutral-105">
                          {editingShop?.id === item.id ? (
                            <select
                              aria-label="Edit size"
                              className="bg-white dark:bg-neutral-955 border border-neutral-350 dark:border-neutral-800 rounded-md px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-indigo-650 outline-none text-neutral-900 dark:text-neutral-100 cursor-pointer"
                              value={editingShop.size || 'A4'}
                              onChange={e => setEditingShop({ ...editingShop, size: e.target.value })}
                            >
                              <option value="A4">A4</option>
                              <option value="A3">A3</option>
                              <option value="A2">A2</option>
                              <option value="A1">A1</option>
                            </select>
                          ) : (
                            <span className="px-2 py-0.5 text-xs border border-neutral-300 dark:border-neutral-700 rounded-md font-semibold text-neutral-700 dark:text-neutral-350">
                              {item.size || 'A4'}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <div className="flex justify-end gap-3">
                            {editingShop?.id === item.id ? (
                              <>
                                <button
                                  onClick={handleEditShop}
                                  className="text-emerald-600 hover:text-emerald-700 p-1 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                  aria-label={`Save changes to product ${item.title}`}
                                >
                                  <Check size={18} />
                                </button>
                                <button
                                  onClick={() => setEditingShop(null)}
                                  className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white p-1 cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
                                  aria-label={`Cancel editing product ${item.title}`}
                                >
                                  <X size={18} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => setEditingShop({ ...item })}
                                  className="text-neutral-600 dark:text-neutral-300 hover:text-indigo-655 dark:hover:text-indigo-400 p-1.5 hover:bg-indigo-500/5 rounded-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                                  aria-label={`Edit item: ${item.title}`}
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteShop(item.id)}
                                  className="text-neutral-600 dark:text-neutral-300 hover:text-red-755 dark:hover:text-red-400 p-1.5 hover:bg-red-500/5 rounded-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                  aria-label={`Delete item: ${item.title}`}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-neutral-250 dark:divide-neutral-800 p-4 space-y-4">
                {shopList.map(item => (
                  <div key={item.id} className="pt-4 first:pt-0 flex flex-col gap-3">
                    <div className="flex gap-4 items-center">
                      <div className="h-14 w-14 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200/10 shrink-0">
                        <img src={item.image} alt="" className="object-cover h-full w-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {editingShop?.id === item.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              aria-label="Edit title"
                              className="w-full bg-white dark:bg-neutral-955 border border-neutral-350 dark:border-neutral-800 rounded-md px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-indigo-650 outline-none text-neutral-900 dark:text-neutral-100"
                              value={editingShop.title}
                              onChange={e => setEditingShop({ ...editingShop, title: e.target.value })}
                            />
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  aria-label="Edit price"
                                  className="w-full bg-white dark:bg-neutral-955 border border-neutral-355 dark:border-neutral-800 rounded-md pl-6 pr-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-indigo-655 outline-none text-neutral-900 dark:text-neutral-100"
                                  value={editingShop.price}
                                  onChange={e => setEditingShop({ ...editingShop, price: Number(e.target.value) })}
                                />
                              </div>
                              <select
                                aria-label="Edit size"
                                className="bg-white dark:bg-neutral-955 border border-neutral-355 dark:border-neutral-800 rounded-md px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-indigo-655 outline-none text-neutral-900 dark:text-neutral-100 cursor-pointer"
                                value={editingShop.size || 'A4'}
                                onChange={e => setEditingShop({ ...editingShop, size: e.target.value })}
                              >
                                <option value="A4">A4</option>
                                <option value="A3">A3</option>
                                <option value="A2">A2</option>
                                <option value="A1">A1</option>
                              </select>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h4 className="font-semibold text-neutral-850 dark:text-neutral-100 truncate">{item.title}</h4>
                            <div className="flex gap-2 items-center mt-1">
                              <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">
                                ${item.price.toFixed(2)}
                              </span>
                              <span className="px-2 py-0.5 text-[10px] border border-neutral-350 dark:border-neutral-700 rounded-md font-semibold text-neutral-600 dark:text-neutral-450">
                                {item.size || 'A4'}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-neutral-150 dark:border-neutral-850">
                      {editingShop?.id === item.id ? (
                        <>
                          <button
                            onClick={handleEditShop}
                            className="flex items-center gap-1 text-xs text-emerald-650 dark:text-emerald-500 hover:text-emerald-700 font-semibold uppercase tracking-wider py-1 px-3 bg-emerald-500/10 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                          >
                            <Check size={14} /> Save
                          </button>
                          <button
                            onClick={() => setEditingShop(null)}
                            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-750 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-white font-semibold uppercase tracking-wider py-1 px-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
                          >
                            <X size={14} /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingShop({ ...item })}
                            className="flex items-center gap-1 text-xs text-indigo-700 dark:text-indigo-400 hover:bg-indigo-500/10 font-semibold uppercase tracking-wider py-1.5 px-3 bg-indigo-500/5 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                            aria-label={`Edit: ${item.title}`}
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteShop(item.id)}
                            className="flex items-center gap-1 text-xs text-red-750 dark:text-red-400 hover:bg-red-500/10 font-semibold uppercase tracking-wider py-1.5 px-3 bg-red-500/5 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            aria-label={`Delete: ${item.title}`}
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import ModalPortal from './ModalPortal';
import {
  Package,
  PackageCheck,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus,
  RefreshCw,
  Bell,
  ShieldCheck,
  CheckSquare,
  Square,
  Trash2,
  Edit3,
  Filter,
  Search,
  DollarSign,
  Layers,
  Clock,
  ArrowRight,
  Shield,
  FileCheck,
  X,
  Wallet,
  Sparkles,
  Heart,
  Flame,
  Trophy,
  Check,
  Coffee,
  Music,
  Sun,
  Moon,
  Star,
  Pencil,
  Zap,
  BookmarkPlus
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Gels & Overlays',
  'Extensions & Tips',
  'Implements & Bits',
  'Art & Charms',
  'Sanitation & PPE',
  'Retail & Aftercare'
];

const RITUAL_CATEGORIES = [
  'Studio Vibe',
  'Station Prep',
  'Tools & Gear',
  'Restock',
  'Creative & Social',
  'Closing Ritual'
];

const RITUAL_CATEGORY_STYLES = {
  'Studio Vibe': 'bg-pink-50 text-pink-700 border-pink-200',
  'Station Prep': 'bg-rose-50 text-brand-wine border-rose-200',
  'Tools & Gear': 'bg-amber-50 text-amber-800 border-amber-200',
  'Restock': 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'Creative & Social': 'bg-purple-50 text-purple-800 border-purple-200',
  'Closing Ritual': 'bg-indigo-50 text-indigo-800 border-indigo-200'
};

const QUICK_PRESETS = [
  { title: 'Fresh matcha/coffee & client beverage bar', category: 'Studio Vibe', shift: 'opening' },
  { title: 'Light amber candle & start lo-fi playlist', category: 'Studio Vibe', shift: 'opening' },
  { title: 'Wipe manicure desk, set fresh wipes & armrest', category: 'Station Prep', shift: 'opening', mandatory: true },
  { title: 'Test LED/UV curing lamps & inspection light', category: 'Tools & Gear', shift: 'opening', mandatory: true },
  { title: 'Restock builder gels & lavender cuticle oils', category: 'Restock', shift: 'opening' },
  { title: 'Snap aesthetic workstation story for Instagram', category: 'Creative & Social', shift: 'opening' },
  { title: 'Ultrasonic cleanse bits & wipe desks for tomorrow', category: 'Closing Ritual', shift: 'closing' }
];

export default function InventoryView({
  inventory = [],
  checklist = [],
  onSaveItem,
  onAdjustStock,
  onDeleteItem,
  onSendLowStockAlert,
  onToggleChecklistItem,
  onSaveChecklistItem,
  onDeleteChecklistItem,
  onResetChecklist,
  onAddToast
}) {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'sanitization'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Personal Rituals state
  const [ritualFilter, setRitualFilter] = useState('all'); // 'all' | 'opening' | 'closing' | 'pending' | 'completed'
  const [isAddingRitual, setIsAddingRitual] = useState(false);
  const [editingRitual, setEditingRitual] = useState(null);
  const [ritualForm, setRitualForm] = useState({
    title: '',
    category: 'Station Prep',
    shift: 'opening',
    description: '',
    mandatory: false
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Gels & Overlays',
    sku: '',
    quantity: 1,
    minThreshold: 3,
    unit: 'bottles',
    supplier: '',
    costPerUnit: 0,
    retailPrice: '',
    location: '',
    notes: ''
  });

  // Sending Alert loading
  const [isSendingAlert, setIsSendingAlert] = useState(false);

  // Calculations
  const lowStockItems = inventory.filter(
    (i) => (Number(i.quantity) || 0) <= (Number(i.minThreshold) || 0)
  );

  const totalInventoryValue = inventory.reduce(
    (sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.costPerUnit) || 0),
    0
  );

  const estimatedRestockCost = lowStockItems.reduce((sum, i) => {
    const deficit = Math.max(0, (Number(i.minThreshold) || 0) - (Number(i.quantity) || 0) + 2);
    return sum + deficit * (Number(i.costPerUnit) || 0);
  }, 0);

  // Checklist Calculations
  const completedChecklist = checklist.filter((c) => c.completed);
  const openingChecklist = checklist.filter((c) => c.shift === 'opening');
  const closingChecklist = checklist.filter((c) => c.shift === 'closing');
  const totalRituals = checklist.length;
  const completedRitualsCount = completedChecklist.length;
  const ritualProgressPercent = totalRituals > 0 ? Math.round((completedRitualsCount / totalRituals) * 100) : 0;
  const isAllRitualsDone = totalRituals > 0 && completedRitualsCount === totalRituals;

  // Personal Rituals Handlers
  const handleSaveRitual = (e) => {
    if (e) e.preventDefault();
    if (!ritualForm.title.trim()) {
      onAddToast && onAddToast('Missing Title', 'Please enter a name for your personal check.', 'warning');
      return;
    }
    if (onSaveChecklistItem) {
      onSaveChecklistItem({
        ...(editingRitual?.id ? { id: editingRitual.id } : {}),
        title: ritualForm.title.trim(),
        category: ritualForm.category || 'Station Prep',
        shift: ritualForm.shift || 'opening',
        description: (ritualForm.description || '').trim(),
        mandatory: Boolean(ritualForm.mandatory),
        completed: editingRitual ? editingRitual.completed : false
      });
    }
    setRitualForm({
      title: '',
      category: 'Station Prep',
      shift: 'opening',
      description: '',
      mandatory: false
    });
    setEditingRitual(null);
    setIsAddingRitual(false);
  };

  const handleApplyPreset = (preset) => {
    setRitualForm({
      title: preset.title,
      category: preset.category,
      shift: preset.shift,
      description: '',
      mandatory: Boolean(preset.mandatory)
    });
    setIsAddingRitual(true);
  };

  const handleStartEditRitual = (item, e) => {
    e.stopPropagation();
    setEditingRitual(item);
    setRitualForm({
      title: item.title || '',
      category: item.category || 'Station Prep',
      shift: item.shift || 'opening',
      description: item.description || '',
      mandatory: Boolean(item.mandatory)
    });
    setIsAddingRitual(true);
  };

  const handleDeleteRitual = (item, e) => {
    e.stopPropagation();
    if (window.confirm(`Delete personal check "${item.title}"?`)) {
      if (onDeleteChecklistItem) {
        onDeleteChecklistItem(item.id);
      }
    }
  };

  const filteredRituals = useMemo(() => {
    return checklist.filter((item) => {
      if (ritualFilter === 'opening') return item.shift === 'opening';
      if (ritualFilter === 'closing') return item.shift === 'closing';
      if (ritualFilter === 'pending') return !item.completed;
      if (ritualFilter === 'completed') return item.completed;
      return true;
    });
  }, [checklist, ritualFilter]);

  const getRitualStatusMessage = () => {
    if (totalRituals === 0) return { title: 'No Checks Added Yet', subtitle: 'Tap below to add your first daily studio check', icon: Sparkles, color: 'text-brand-wine' };
    if (isAllRitualsDone) return { title: '100% Atelier Perfection!', subtitle: "All personal rituals complete. Ready for today's clients!", icon: Trophy, color: 'text-emerald-700' };
    if (ritualProgressPercent >= 75) return { title: 'Almost Studio Ready!', subtitle: 'Only 1 or 2 small checks remaining • Final polish!', icon: Sparkles, color: 'text-brand-wine' };
    if (ritualProgressPercent >= 40) return { title: 'In the Flow!', subtitle: 'Halfway there • Your studio space is looking immaculate.', icon: Flame, color: 'text-amber-700' };
    return { title: 'Morning Prep Underway', subtitle: 'Take your time and begin your daily studio rituals.', icon: Sun, color: 'text-brand-wine' };
  };

  // Filtering inventory
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    const matchesLowStock = showLowStockOnly
      ? (Number(item.quantity) || 0) <= (Number(item.minThreshold) || 0)
      : true;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Gels & Overlays',
      sku: '',
      quantity: 5,
      minThreshold: 3,
      unit: 'bottle',
      supplier: '',
      costPerUnit: 450,
      retailPrice: '',
      location: 'Main Station',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      category: item.category || 'Gels & Overlays',
      sku: item.sku || '',
      quantity: item.quantity || 0,
      minThreshold: item.minThreshold || 0,
      unit: item.unit || 'units',
      supplier: item.supplier || '',
      costPerUnit: item.costPerUnit || 0,
      retailPrice: item.retailPrice !== undefined ? item.retailPrice : '',
      location: item.location || '',
      notes: item.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSaveItem({
      ...(editingItem ? { id: editingItem.id } : {}),
      name: formData.name.trim(),
      category: formData.category,
      sku: formData.sku.trim(),
      quantity: Number(formData.quantity) || 0,
      minThreshold: Number(formData.minThreshold) || 0,
      unit: formData.unit.trim() || 'units',
      supplier: formData.supplier.trim(),
      costPerUnit: Number(formData.costPerUnit) || 0,
      retailPrice: formData.retailPrice ? Number(formData.retailPrice) : undefined,
      location: formData.location.trim(),
      notes: formData.notes.trim()
    });

    setIsModalOpen(false);
  };

  const handleTriggerLowStockAlert = async () => {
    if (lowStockItems.length === 0) {
      if (onAddToast) onAddToast('Inventory Alert', 'All studio supplies are currently stocked above threshold.', 'info');
      return;
    }
    setIsSendingAlert(true);
    try {
      await onSendLowStockAlert();
      if (onAddToast) onAddToast('Phone Alert Sent', `Sent restock warning for ${lowStockItems.length} items to your phone.`, 'success');
    } catch (err) {
      if (onAddToast) onAddToast('Alert Failed', err.message, 'error');
    } finally {
      setIsSendingAlert(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-subtle text-brand-wine text-xs font-semibold mb-2 border border-border-subtle">
            <Sparkles className="w-3.5 h-3.5 text-brand-wine" />
            <span>Studio Supplies & Personal Rituals</span>
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-text-ink tracking-tight">
            Inventory & Studio Rituals
          </h2>
          <p className="text-xs text-text-muted mt-1 max-w-xl">
            Manage salon builder gels, Gel-X tips, precision implements, and your personal daily studio checks.
          </p>
        </div>

        {/* Dual Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-studio-canvas p-1 rounded-2xl border border-border-subtle self-start sm:self-auto shadow-xs">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 min-h-[38px] ${
              activeTab === 'inventory'
                ? 'bg-studio-surface text-text-ink shadow-studio border border-border-subtle font-bold'
                : 'text-text-muted hover:text-text-ink'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-brand-wine" />
            <span>Supplies & Stock</span>
            {lowStockItems.length > 0 && (
              <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                {lowStockItems.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sanitization')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 min-h-[38px] ${
              activeTab === 'sanitization'
                ? 'bg-studio-surface text-text-ink shadow-studio border border-border-subtle font-bold'
                : 'text-text-muted hover:text-text-ink'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Personal Rituals</span>
            <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
              isAllRitualsDone
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-rose-100 text-rose-900'
            }`}>
              {completedRitualsCount}/{totalRituals}
            </span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-studio-surface rounded-3xl p-5 border border-border-subtle shadow-xs space-y-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Tracked Supplies
            </span>
            <div className="w-9 h-9 rounded-2xl bg-studio-canvas text-brand-wine flex items-center justify-center border border-border-subtle">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-text-ink">
              {inventory.length}
            </span>
            <span className="text-xs text-text-muted">SKUs</span>
          </div>
          <p className="text-xs text-text-muted mt-2">
            Professional gels, tips, bits & aftercare
          </p>
        </div>

        <div className="bg-studio-surface rounded-3xl p-5 border border-border-subtle shadow-xs space-y-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Low Stock Warnings
            </span>
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border ${lowStockItems.length > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-text-ink">
              {lowStockItems.length}
            </span>
            <span className="text-xs text-text-muted">items below min</span>
          </div>
          <p className="text-xs text-amber-700 font-medium mt-2">
            {lowStockItems.length > 0 ? 'Requires supplier reorder soon' : 'All stock levels optimal'}
          </p>
        </div>

        <div className="bg-studio-surface rounded-3xl p-5 border border-border-subtle shadow-xs space-y-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Inventory Valuation
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-text-muted font-bold">₹</span>
            <span className="text-3xl font-bold font-display text-text-ink">
              {Math.round(totalInventoryValue).toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-2">
            {lowStockItems.length > 0
              ? `Estimated ~₹${Math.round(estimatedRestockCost).toLocaleString('en-IN')} restock budget`
              : 'Zero restock required'}
          </p>
        </div>

        <div className="bg-studio-surface rounded-3xl p-5 border border-border-subtle shadow-xs space-y-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Studio Readiness
            </span>
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border ${isAllRitualsDone ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-brand-wine border-rose-200'}`}>
              {isAllRitualsDone ? <Trophy className="w-4 h-4 text-emerald-700" /> : <Sparkles className="w-4 h-4 text-brand-wine" />}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-text-ink">
              {ritualProgressPercent}%
            </span>
            <span className="text-xs text-text-muted">ready</span>
          </div>
          <p className="text-xs text-text-muted font-medium mt-2 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-wine" />
            <span>{completedRitualsCount}/{totalRituals} personal checks done</span>
          </p>
        </div>
      </div>

      {/* Tab 1: Inventory Supplies */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-studio-surface rounded-3xl p-5 border border-border-subtle shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search supply name, SKU, or supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-studio-canvas border border-border-subtle focus:outline-none focus:border-brand-wine text-base sm:text-xs text-text-ink placeholder:text-text-muted"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-2 min-h-[40px] ${
                    showLowStockOnly
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-studio-surface text-text-secondary border-border-subtle hover:bg-studio-canvas'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Low Stock Only ({lowStockItems.length})</span>
                </button>

                <button
                  onClick={handleTriggerLowStockAlert}
                  disabled={isSendingAlert || lowStockItems.length === 0}
                  className="px-4 py-2 rounded-xl bg-studio-surface border border-border-subtle hover:border-brand-wine text-text-ink text-xs font-semibold shadow-xs transition-all flex items-center gap-2 disabled:opacity-50 min-h-[40px]"
                  title="Sends an instant push alert of all low-stock items to Sirii's phone via NTFY"
                >
                  <Bell className="w-3.5 h-3.5 text-brand-wine" />
                  <span>{isSendingAlert ? 'Pinging Phone...' : 'Send NTFY Restock Alert'}</span>
                </button>

                <button
                  onClick={handleOpenAdd}
                  className="px-4 py-2 rounded-xl bg-brand-wine hover:bg-brand-wineHover text-white text-xs font-semibold shadow-studio transition-all flex items-center gap-2 active:scale-95 min-h-[40px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Supply Item</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-border-subtle">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>Category:</span>
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all min-h-[34px] ${
                    selectedCategory === cat
                      ? 'bg-brand-wine text-white shadow-studio'
                      : 'bg-studio-canvas hover:bg-studio-subtle text-text-secondary border border-border-subtle'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Supplies Grid */}
          {inventory.length === 0 ? (
            <div className="bg-studio-surface rounded-3xl p-12 border border-border-subtle text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-full bg-studio-canvas text-brand-wine flex items-center justify-center border border-border-subtle">
                <Package className="w-6 h-6" />
              </div>
              <p className="font-display font-semibold text-lg text-text-ink">
                No Supplies Cataloged Yet
              </p>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                Your studio inventory is empty and ready. Catalog your salon builder gels, Gel-X tips, precision implements, and aftercare retail stock here.
              </p>
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-wine text-white text-xs font-semibold shadow-studio hover:bg-brand-wineHover min-h-[44px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Supply Item</span>
              </button>
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="bg-studio-surface rounded-3xl p-12 border border-border-subtle text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-full bg-studio-canvas text-brand-wine flex items-center justify-center border border-border-subtle">
                <Package className="w-6 h-6" />
              </div>
              <p className="font-display font-semibold text-lg text-text-ink">
                No Supplies Found
              </p>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                No items match your search or filter. Try clearing filters or search for another item.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setShowLowStockOnly(false);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-wine text-white text-xs font-semibold shadow-studio hover:bg-brand-wineHover min-h-[44px]"
              >
                <span>Clear Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredInventory.map((item) => {
                const isLow = (Number(item.quantity) || 0) <= (Number(item.minThreshold) || 0);
                const isOut = (Number(item.quantity) || 0) <= 0;

                return (
                  <div
                    key={item.id}
                    className={`bg-studio-surface rounded-3xl p-5 border transition-all flex flex-col justify-between shadow-xs hover:shadow-studio ${
                      isOut
                        ? 'border-rose-300 bg-rose-50/20'
                        : isLow
                        ? 'border-amber-300 bg-amber-50/20'
                        : 'border-border-subtle hover:border-border-strong'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top: Category & Status */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-studio-canvas border border-border-subtle text-text-secondary">
                          {item.category}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                            isOut
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : isLow
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}
                        >
                          {isLow && <AlertTriangle className="w-2.5 h-2.5" />}
                          <span>{item.status || (isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock')}</span>
                        </span>
                      </div>

                      {/* Name & SKU */}
                      <div>
                        <h4 className="font-display font-semibold text-base text-text-ink leading-snug">
                          {item.name}
                        </h4>
                        {item.sku && (
                          <span className="font-mono text-[10px] text-text-muted">
                            SKU: {item.sku}
                          </span>
                        )}
                      </div>

                      {/* Notes / Description */}
                      {item.notes && (
                        <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                          {item.notes}
                        </p>
                      )}

                      {/* Meta Info: Supplier & Location */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-subtle text-xs">
                        <div>
                          <span className="text-text-muted block text-[10px] uppercase font-bold tracking-wider">Supplier</span>
                          <span className="font-semibold text-text-ink truncate block">
                            {item.supplier || 'Standard Supplier'}
                          </span>
                        </div>
                        <div>
                          <span className="text-text-muted block text-[10px] uppercase font-bold tracking-wider">Location</span>
                          <span className="font-semibold text-text-ink truncate block">
                            {item.location || 'Studio Storage'}
                          </span>
                        </div>
                      </div>

                      {/* Financial info */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-studio-canvas p-2.5 rounded-xl border border-border-subtle">
                        <div>
                          <span className="text-text-muted block text-[10px]">Cost / Unit</span>
                          <span className="font-semibold font-display text-text-ink">
                            ₹{Number(item.costPerUnit || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-text-muted block text-[10px]">Min Threshold</span>
                          <span className="font-semibold text-text-ink">
                            {item.minThreshold} {item.unit}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Stock Adjuster & Actions */}
                    <div className="pt-4 mt-4 border-t border-border-subtle flex items-center justify-between gap-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center gap-1.5 bg-studio-canvas p-1 rounded-2xl border border-border-subtle">
                        <button
                          onClick={() => onAdjustStock(item.id, -1, true)}
                          disabled={item.quantity <= 0}
                          className="w-8 h-8 rounded-xl bg-studio-surface hover:bg-rose-50 text-text-secondary hover:text-rose-600 flex items-center justify-center transition-all disabled:opacity-40 active:scale-95 shadow-xs border border-border-subtle"
                          title="Reduce stock by 1"
                          aria-label="Reduce stock by 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <div className="px-2 text-center min-w-[50px]">
                          <span className="font-bold text-xs text-text-ink block">
                            {item.quantity}
                          </span>
                          <span className="text-[9px] text-text-muted block -mt-0.5">
                            {item.unit}
                          </span>
                        </div>

                        <button
                          onClick={() => onAdjustStock(item.id, 1, false)}
                          className="w-8 h-8 rounded-xl bg-studio-surface hover:bg-emerald-50 text-text-secondary hover:text-emerald-700 flex items-center justify-center transition-all active:scale-95 shadow-xs border border-border-subtle"
                          title="Add 1 to stock"
                          aria-label="Add 1 to stock"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Edit & Delete actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="w-9 h-9 rounded-xl bg-studio-canvas hover:bg-studio-subtle text-text-muted hover:text-text-ink flex items-center justify-center transition-all border border-border-subtle"
                          title="Edit supply details"
                          aria-label="Edit supply"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="w-9 h-9 rounded-xl bg-studio-canvas hover:bg-rose-50 text-text-muted hover:text-rose-600 flex items-center justify-center transition-all border border-border-subtle"
                          title="Delete supply item"
                          aria-label="Delete supply"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Personal Studio Rituals & Daily Checks */}
      {activeTab === 'sanitization' && (
        <div className="space-y-6 animate-fade-in">
          {/* Gamified Readiness & Mastery Banner */}
          <div className="bg-studio-surface rounded-3xl p-6 sm:p-7 border border-border-subtle shadow-xs space-y-6 relative overflow-hidden">
            {/* Ambient subtle glow when 100% completed */}
            {isAllRitualsDone && (
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-pink-500/10 to-brand-wine/10 pointer-events-none animate-pulse" />
            )}

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-brand-wine text-[11px] font-bold border border-rose-200">
                    <Sparkles className="w-3.5 h-3.5 text-brand-wine" />
                    <span>Personal Daily Checklist</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-200">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span>7-Day Studio Streak</span>
                  </div>

                  {isAllRitualsDone && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold border border-emerald-300 animate-bounce">
                      <Trophy className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Ready for Clients</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <h3 className="font-display font-semibold text-xl sm:text-2xl text-text-ink">
                    {getRitualStatusMessage().title}
                  </h3>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  {getRitualStatusMessage().subtitle}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
                <button
                  onClick={onResetChecklist}
                  className="px-4 py-2.5 rounded-2xl bg-studio-canvas hover:bg-studio-subtle text-text-ink text-xs font-semibold border border-border-subtle shadow-xs transition-all flex items-center gap-2 min-h-[44px]"
                  title="Reset today's checks for a fresh opening shift"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-brand-wine" />
                  <span>Reset for New Day</span>
                </button>

                <button
                  onClick={() => {
                    setEditingRitual(null);
                    setRitualForm({
                      title: '',
                      category: 'Station Prep',
                      shift: 'opening',
                      description: '',
                      mandatory: false
                    });
                    setIsAddingRitual(!isAddingRitual);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-wine to-brand-wine-dark hover:brightness-110 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-2 min-h-[44px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingRitual ? 'Close Form' : 'Add Custom Check'}</span>
                </button>
              </div>
            </div>

            {/* Gamification Progress Bar */}
            <div className="space-y-2 pt-2 border-t border-border-subtle relative z-10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-text-ink flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-wine" />
                  <span>Atelier Readiness Level</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text-muted">
                    {completedRitualsCount} of {totalRituals} completed
                  </span>
                  <span className="font-display font-bold text-base text-brand-wine">
                    {ritualProgressPercent}%
                  </span>
                </div>
              </div>

              {/* Animated Progress Track */}
              <div className="w-full h-3 rounded-full bg-studio-canvas p-0.5 border border-border-subtle overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-400 via-pink-500 to-brand-wine transition-all duration-700 ease-out"
                  style={{ width: `${ritualProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Preset Inspiration Chips */}
          <div className="bg-studio-surface rounded-3xl p-4 sm:p-5 border border-border-subtle shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-wine" />
                <span>Quick-Add Studio Inspiration (1-Tap Add)</span>
              </span>
              <span className="text-[10px] text-text-muted">Tap to load into form</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {QUICK_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  className="px-3.5 py-2 rounded-xl bg-studio-canvas hover:bg-rose-50 hover:border-brand-wine/30 border border-border-subtle text-xs text-text-ink font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3 h-3 text-brand-wine" />
                  <span>{p.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add / Edit Ritual Form Card */}
          {isAddingRitual && (
            <form onSubmit={handleSaveRitual} className="bg-studio-surface rounded-3xl p-6 border-2 border-brand-wine/30 shadow-studio space-y-5 animate-slide-down">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-brand-wine flex items-center justify-center border border-rose-200">
                    <BookmarkPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-base text-text-ink">
                      {editingRitual ? 'Edit Personal Check' : 'Create Custom Studio Check'}
                    </h4>
                    <span className="text-[10px] text-text-muted">
                      Tailor this check for your own daily studio workflow
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsAddingRitual(false);
                    setEditingRitual(null);
                  }}
                  className="w-8 h-8 rounded-full bg-studio-canvas hover:bg-studio-subtle flex items-center justify-center text-text-muted hover:text-text-ink transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-text-ink flex items-center justify-between">
                    <span>Check Title *</span>
                    <span className="text-[10px] text-text-muted">Keep it personal and actionable</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Light amber candle & queue studio lo-fi playlist..."
                    value={ritualForm.title}
                    onChange={(e) => setRitualForm({ ...ritualForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-studio-canvas border border-border-subtle focus:outline-none focus:border-brand-wine text-text-ink text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-ink">Category</label>
                  <select
                    value={ritualForm.category}
                    onChange={(e) => setRitualForm({ ...ritualForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-studio-canvas border border-border-subtle focus:outline-none focus:border-brand-wine text-text-ink text-xs"
                  >
                    {RITUAL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-ink">When do you do this?</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRitualForm({ ...ritualForm, shift: 'opening' })}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                        ritualForm.shift === 'opening'
                          ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold'
                          : 'bg-studio-canvas text-text-muted border-border-subtle'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-600" />
                      <span>Morning Prep</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRitualForm({ ...ritualForm, shift: 'closing' })}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                        ritualForm.shift === 'closing'
                          ? 'bg-indigo-50 text-indigo-900 border-indigo-300 font-bold'
                          : 'bg-studio-canvas text-text-muted border-border-subtle'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Closing Ritual</span>
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-text-ink">Optional Details or Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Lavender cuticle pens are in top left drawer"
                    value={ritualForm.description}
                    onChange={(e) => setRitualForm({ ...ritualForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-studio-canvas border border-border-subtle focus:outline-none focus:border-brand-wine text-text-ink text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-ink select-none">
                  <input
                    type="checkbox"
                    checked={ritualForm.mandatory}
                    onChange={(e) => setRitualForm({ ...ritualForm, mandatory: e.target.checked })}
                    className="w-4 h-4 accent-brand-wine rounded"
                  />
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    <span>Mark as High Priority check</span>
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingRitual(false);
                      setEditingRitual(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs text-text-muted hover:text-text-ink transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-brand-wine hover:bg-brand-wine-dark text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingRitual ? 'Save Changes' : 'Add to Rituals'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Filter Bar & Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'All Checks', count: totalRituals },
                { id: 'opening', label: 'Morning Prep', count: openingChecklist.length },
                { id: 'closing', label: 'Closing Ritual', count: closingChecklist.length },
                { id: 'pending', label: 'To Do', count: totalRituals - completedRitualsCount },
                { id: 'completed', label: 'Done', count: completedRitualsCount }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setRitualFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                    ritualFilter === f.id
                      ? 'bg-brand-wine text-white shadow-xs'
                      : 'bg-studio-surface text-text-muted hover:text-text-ink border border-border-subtle'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    ritualFilter === f.id ? 'bg-white/20 text-white' : 'bg-studio-canvas text-text-muted'
                  }`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            <span className="text-xs text-text-muted font-medium self-end sm:self-auto">
              Showing {filteredRituals.length} check{filteredRituals.length === 1 ? '' : 's'}
            </span>
          </div>

          {/* Checklist Items Grid/List */}
          <div className="space-y-3">
            {filteredRituals.length === 0 ? (
              <div className="bg-studio-surface rounded-3xl p-10 border border-border-subtle text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-studio-canvas text-brand-wine flex items-center justify-center mx-auto border border-border-subtle">
                  <Sparkles className="w-6 h-6 text-brand-wine" />
                </div>
                <h4 className="font-display font-semibold text-lg text-text-ink">
                  No checks match this filter
                </h4>
                <p className="text-xs text-text-muted max-w-sm mx-auto">
                  {checklist.length === 0
                    ? 'Your personal rituals list is currently empty. Add your morning station setup, ambient checks, or closing duties above!'
                    : 'Switch your filter or tap "Add Custom Check" to add a new personal routine.'}
                </p>
                <button
                  onClick={() => setIsAddingRitual(true)}
                  className="px-4 py-2 rounded-xl bg-brand-wine text-white text-xs font-bold hover:brightness-110 transition-all inline-flex items-center gap-1.5 mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Check</span>
                </button>
              </div>
            ) : (
              filteredRituals.map((item) => {
                const catClass = RITUAL_CATEGORY_STYLES[item.category] || 'bg-studio-canvas text-text-muted border-border-subtle';
                const isOpening = item.shift === 'opening';

                return (
                  <div
                    key={item.id}
                    onClick={() => onToggleChecklistItem(item.id)}
                    className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-3.5 sm:gap-4 group ${
                      item.completed
                        ? 'bg-emerald-50/30 border-emerald-200/80'
                        : 'bg-studio-surface border-border-subtle hover:border-brand-wine/40 hover:shadow-xs'
                    }`}
                  >
                    {/* Gamified Check Button */}
                    <div className="mt-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleChecklistItem(item.id);
                        }}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                          item.completed
                            ? 'bg-emerald-600 text-white shadow-xs scale-105'
                            : 'bg-studio-canvas border border-border-subtle text-text-muted group-hover:border-brand-wine group-hover:text-brand-wine'
                        }`}
                        title={item.completed ? 'Mark pending' : 'Check off'}
                      >
                        {item.completed ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <Heart className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Check Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-semibold transition-all ${
                            item.completed
                              ? 'line-through text-text-muted'
                              : 'text-text-ink'
                          }`}>
                            {item.title}
                          </span>

                          {item.mandatory && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-brand-wine text-[9px] font-bold border border-rose-200">
                              <Star className="w-2.5 h-2.5 text-brand-wine fill-brand-wine shrink-0" />
                              <span>Priority</span>
                            </span>
                          )}
                        </div>

                        {/* Category & Shift Badges */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catClass}`}>
                            {item.category || 'General'}
                          </span>

                          <span className="text-[10px] text-text-muted px-2 py-0.5 rounded-full bg-studio-canvas border border-border-subtle flex items-center gap-1">
                            {isOpening ? <Sun className="w-2.5 h-2.5 text-amber-600" /> : <Moon className="w-2.5 h-2.5 text-indigo-600" />}
                            <span>{isOpening ? 'Morning' : 'Closing'}</span>
                          </span>
                        </div>
                      </div>

                      {item.description && (
                        <p className={`text-xs leading-relaxed ${item.completed ? 'text-text-muted/70' : 'text-text-muted'}`}>
                          {item.description}
                        </p>
                      )}

                      {/* Verified details timestamp */}
                      {item.completed && item.completedAt && (
                        <div className="pt-1 flex items-center gap-2 text-[10px] text-emerald-800 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            Checked off at {new Date(item.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions: Edit & Delete buttons */}
                    <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => handleStartEditRitual(item, e)}
                        className="w-8 h-8 rounded-xl bg-studio-canvas hover:bg-studio-subtle text-text-muted hover:text-text-ink flex items-center justify-center transition-colors border border-border-subtle"
                        title="Edit check"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteRitual(item, e)}
                        className="w-8 h-8 rounded-xl bg-studio-canvas hover:bg-rose-50 text-text-muted hover:text-rose-600 flex items-center justify-center transition-colors border border-border-subtle"
                        title="Delete check"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Supply Item Modal */}
      {isModalOpen && (
        <ModalPortal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {/* Dedicated full-bleed non-scrolling backdrop */}
          <div
            className="fixed inset-0 z-[70] bg-studio-ink/60 backdrop-blur-md transition-opacity"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />
          {/* Scrollable floating dialog container */}
          <div className="fixed inset-0 z-[71] flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto pointer-events-none">
            <div className="bg-studio-surface rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 border-t sm:border border-border-subtle shadow-studio relative max-h-[92vh] overflow-y-auto font-sans pointer-events-auto">
            <div className="w-10 h-1.5 rounded-full bg-border-subtle mx-auto mb-3 sm:hidden" />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 sm:right-5 top-4 sm:top-5 w-8 h-8 rounded-full bg-studio-canvas flex items-center justify-center text-text-muted hover:text-text-ink transition-colors min-h-[36px] min-w-[36px]"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-wine">
                Studio Inventory Catalog
              </span>
              <h3 className="font-display font-semibold text-xl text-text-ink">
                {editingItem ? 'Edit Supply Item' : 'Add New Supply Item'}
              </h3>
              <p className="text-xs text-text-muted">
                Save stock quantities, supplier info, and minimum restock thresholds.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apres Gel-X Natural Coffin (Medium)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas focus:outline-none focus:border-brand-wine focus:bg-white text-base sm:text-xs text-text-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle focus:outline-none focus:border-brand-wine text-base sm:text-xs text-text-ink bg-studio-canvas"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    SKU / Product Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. APX-NC-MED"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas focus:outline-none focus:border-brand-wine focus:bg-white text-base sm:text-xs text-text-ink font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Current Qty *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas focus:outline-none focus:border-brand-wine focus:bg-white text-base sm:text-xs text-text-ink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Min Threshold *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.minThreshold}
                    onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas focus:outline-none focus:border-brand-wine focus:bg-white text-base sm:text-xs text-text-ink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Unit Description
                  </label>
                  <input
                    type="text"
                    placeholder="bottle, box, pack"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas focus:outline-none focus:border-brand-wine focus:bg-white text-base sm:text-xs text-text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Cost per Unit (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.costPerUnit}
                    onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas focus:outline-none focus:border-brand-wine focus:bg-white text-base sm:text-xs text-text-ink font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Retail Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Optional for retail goods"
                    value={formData.retailPrice}
                    onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas focus:outline-none focus:border-brand-wine focus:bg-white text-base sm:text-xs text-text-ink font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Supplier / Brand
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The GelBottle, Apres"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas focus:outline-none focus:border-brand-wine focus:bg-white text-base sm:text-xs text-text-ink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Storage Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Station 1, Drawer B-2"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas focus:outline-none focus:border-brand-wine focus:bg-white text-base sm:text-xs text-text-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Item Notes & Usage Details
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Best seller for bridal sets, requires dry Russian prep"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-subtle bg-studio-canvas focus:outline-none focus:border-brand-wine focus:bg-white text-base sm:text-xs text-text-ink resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border-subtle hover:bg-studio-canvas text-xs font-semibold text-text-secondary transition-all min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-wine hover:bg-brand-wineHover text-white text-xs font-semibold shadow-studio transition-all active:scale-95 min-h-[44px]"
                >
                  {editingItem ? 'Save Changes' : 'Create Supply Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </ModalPortal>
    )}
  </div>
);
}

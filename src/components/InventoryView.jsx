import React, { useState } from 'react';
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
  Wallet
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

export default function InventoryView({
  inventory = [],
  checklist = [],
  onSaveItem,
  onAdjustStock,
  onDeleteItem,
  onSendLowStockAlert,
  onToggleChecklistItem,
  onResetChecklist,
  onAddToast
}) {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'sanitization'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

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
  const isOpeningComplete = openingChecklist
    .filter((c) => c.mandatory)
    .every((c) => c.completed);

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
            <Package className="w-3.5 h-3.5 text-brand-wine" />
            <span>Studio Supplies & Protocols</span>
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-text-ink tracking-tight">
            Inventory & Sanitation
          </h2>
          <p className="text-xs text-text-muted mt-1 max-w-xl">
            Manage salon builder gels, Gel-X tips, precision implements, and OSHA/Board sterilization compliance logs.
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
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Sanitation Protocols</span>
            <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
              {completedChecklist.length}/{checklist.length}
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
            Estimated ~₹{Math.round(estimatedRestockCost).toLocaleString('en-IN')} restock budget
          </p>
        </div>

        <div className="bg-studio-surface rounded-3xl p-5 border border-border-subtle shadow-xs space-y-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Sanitation Compliance
            </span>
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border ${isOpeningComplete ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-text-ink">
              {checklist.length > 0 ? Math.round((completedChecklist.length / checklist.length) * 100) : 100}%
            </span>
            <span className="text-xs text-text-muted">verified</span>
          </div>
          <p className="text-xs text-emerald-700 font-medium mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>State Board & OSHA compliant</span>
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
          {filteredInventory.length === 0 ? (
            <div className="bg-studio-surface rounded-3xl p-12 border border-border-subtle text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-full bg-studio-canvas text-brand-wine flex items-center justify-center border border-border-subtle">
                <Package className="w-6 h-6" />
              </div>
              <p className="font-display font-semibold text-lg text-text-ink">
                No Supplies Found
              </p>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                No items match your search or filter. Try clearing filters or add a new supply item to your studio inventory.
              </p>
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-wine text-white text-xs font-semibold shadow-studio hover:bg-brand-wineHover min-h-[44px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Supply Item</span>
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

      {/* Tab 2: Sanitization Protocols Checklist */}
      {activeTab === 'sanitization' && (
        <div className="space-y-6">
          {/* Sanitation Banner */}
          <div className="bg-studio-surface rounded-3xl p-6 border border-border-subtle shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>OSHA & Board of Cosmetology Compliant</span>
              </div>
              <h3 className="font-display font-semibold text-xl text-text-ink">
                Daily Studio Sterilization & Hygiene Protocol
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Nails by Sirii enforces autoclave medical sterilization, 24-hr Barbicide immersion, and HEPA air filtration for client safety.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onResetChecklist}
                className="px-4 py-2.5 rounded-2xl bg-studio-surface border border-border-subtle hover:bg-studio-canvas text-text-ink text-xs font-semibold shadow-xs transition-all flex items-center gap-2 min-h-[44px]"
                title="Resets today's checklist items to uncompleted for the morning opening shift"
              >
                <RefreshCw className="w-3.5 h-3.5 text-brand-wine" />
                <span>Reset for New Day</span>
              </button>
            </div>
          </div>

          {/* Opening Shift Protocols */}
          <div className="bg-studio-surface rounded-3xl p-6 border border-border-subtle shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-studio-canvas text-brand-wine flex items-center justify-center border border-border-subtle">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-base text-text-ink">
                    Morning Opening Protocols
                  </h4>
                  <span className="text-[10px] text-text-muted">
                    Must be inspected prior to the first client booking
                  </span>
                </div>
              </div>

              <span className="text-xs font-semibold text-brand-wine">
                {openingChecklist.filter((c) => c.completed).length} / {openingChecklist.length} Verified
              </span>
            </div>

            <div className="space-y-3">
              {openingChecklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleChecklistItem(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    item.completed
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-studio-canvas/50 border-border-subtle hover:border-brand-wine/40'
                  }`}
                >
                  <div className="mt-0.5">
                    {item.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-700" />
                    ) : (
                      <Square className="w-5 h-5 text-text-muted hover:text-brand-wine transition-colors" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${item.completed ? 'text-text-muted line-through' : 'text-text-ink'}`}>
                          {item.title}
                        </span>
                        {item.mandatory && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[9px] font-bold">
                            Mandatory
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider px-2 py-0.5 rounded bg-studio-surface border border-border-subtle">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-text-muted leading-relaxed">
                      {item.description}
                    </p>

                    {item.completed && item.completedAt && (
                      <div className="pt-1 flex items-center gap-2 text-[10px] text-emerald-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified by {item.signedBy || 'Sirii'} at {new Date(item.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evening Closing Protocols */}
          <div className="bg-studio-surface rounded-3xl p-6 border border-border-subtle shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-studio-canvas text-accent-gold flex items-center justify-center border border-border-subtle">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-base text-text-ink">
                    Evening Closing & Sterilization Cycle
                  </h4>
                  <span className="text-[10px] text-text-muted">
                    Completed at the conclusion of studio service hours
                  </span>
                </div>
              </div>

              <span className="text-xs font-semibold text-text-secondary">
                {closingChecklist.filter((c) => c.completed).length} / {closingChecklist.length} Verified
              </span>
            </div>

            <div className="space-y-3">
              {closingChecklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleChecklistItem(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    item.completed
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-studio-canvas/50 border-border-subtle hover:border-brand-wine/40'
                  }`}
                >
                  <div className="mt-0.5">
                    {item.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-700" />
                    ) : (
                      <Square className="w-5 h-5 text-text-muted hover:text-brand-wine transition-colors" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${item.completed ? 'text-text-muted line-through' : 'text-text-ink'}`}>
                          {item.title}
                        </span>
                        {item.mandatory && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[9px] font-bold">
                            Mandatory
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider px-2 py-0.5 rounded bg-studio-surface border border-border-subtle">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-text-muted leading-relaxed">
                      {item.description}
                    </p>

                    {item.completed && item.completedAt && (
                      <div className="pt-1 flex items-center gap-2 text-[10px] text-emerald-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified by {item.signedBy || 'Sirii'} at {new Date(item.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Supply Item Modal */}
      {isModalOpen && (
        <ModalPortal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4 bg-studio-ink/60 backdrop-blur-md overflow-y-auto">
            <div className="bg-studio-surface rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 border-t sm:border border-border-subtle shadow-studio relative max-h-[92vh] overflow-y-auto font-sans">
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

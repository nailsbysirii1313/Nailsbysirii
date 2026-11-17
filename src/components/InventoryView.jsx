import React, { useState } from 'react';
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
  Sparkles,
  Clock,
  ArrowRight,
  Shield,
  FileCheck,
  X
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
      costPerUnit: 25,
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
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-atelier-rose50 border border-atelier-rose200 text-atelier-rose600 text-xs font-semibold mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Studio Supplies & Protocols</span>
          </div>
          <h2 className="font-serif italic font-bold text-2xl sm:text-3xl text-atelier-noir">
            Inventory & Sanitation
          </h2>
          <p className="text-xs sm:text-sm text-atelier-muted">
            Manage salon builder gels, Gel-X tips, implements, and OSHA/Board sterilization compliance.
          </p>
        </div>

        {/* Dual Tab Buttons */}
        <div className="flex items-center gap-2 bg-atelier-cream/80 p-1.5 rounded-2xl border border-atelier-champagneBorder self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'bg-white text-atelier-noir shadow-soft border border-atelier-champagneBorder/60'
                : 'text-atelier-muted hover:text-atelier-noir'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-atelier-rose500" />
            <span>Supplies & Stock</span>
            {lowStockItems.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                {lowStockItems.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sanitization')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'sanitization'
                ? 'bg-white text-atelier-noir shadow-soft border border-atelier-champagneBorder/60'
                : 'text-atelier-muted hover:text-atelier-noir'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sanitation Protocols</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {completedChecklist.length}/{checklist.length}
            </span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-atelier-champagneBorder shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-atelier-muted uppercase tracking-wider">
              Tracked Supplies
            </span>
            <div className="w-9 h-9 rounded-2xl bg-atelier-rose50 text-atelier-rose600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-atelier-noir">
              {inventory.length}
            </span>
            <span className="text-xs text-atelier-muted">SKUs</span>
          </div>
          <p className="text-[11px] text-atelier-muted font-medium mt-2">
            Professional gels, tips, bits & aftercare
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-atelier-champagneBorder shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-atelier-muted uppercase tracking-wider">
              Low Stock Warnings
            </span>
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${lowStockItems.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-atelier-noir">
              {lowStockItems.length}
            </span>
            <span className="text-xs text-atelier-muted">items below min</span>
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-2">
            {lowStockItems.length > 0 ? 'Requires supplier reorder soon' : 'All stock levels optimal'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-atelier-champagneBorder shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-atelier-muted uppercase tracking-wider">
              Inventory Valuation
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-atelier-muted font-semibold">₹</span>
            <span className="text-3xl font-bold font-serif text-atelier-noir">
              {Math.round(totalInventoryValue).toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-atelier-muted font-medium mt-2">
            Estimated ~₹{Math.round(estimatedRestockCost).toLocaleString('en-IN')} restock budget
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-atelier-champagneBorder shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-atelier-muted uppercase tracking-wider">
              Sanitation Compliance
            </span>
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${isOpeningComplete ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-atelier-noir">
              {checklist.length > 0 ? Math.round((completedChecklist.length / checklist.length) * 100) : 100}%
            </span>
            <span className="text-xs text-atelier-muted">verified</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>State Board & OSHA compliant</span>
          </p>
        </div>
      </div>

      {/* Tab 1: Inventory Supplies */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-3xl p-5 border border-atelier-champagneBorder shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-atelier-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search supply name, SKU, or supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-atelier-cream/50 border border-atelier-champagneBorder focus:outline-none focus:border-atelier-rose400 text-base sm:text-xs text-atelier-noir placeholder:text-atelier-muted"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all border flex items-center gap-2 ${
                    showLowStockOnly
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-white text-atelier-charcoal border-atelier-champagneBorder hover:border-atelier-rose300'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Low Stock Only ({lowStockItems.length})</span>
                </button>

                <button
                  onClick={handleTriggerLowStockAlert}
                  disabled={isSendingAlert || lowStockItems.length === 0}
                  className="px-4 py-2 rounded-2xl bg-white border border-atelier-champagneBorder hover:border-atelier-rose300 text-atelier-noir text-xs font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                  title="Sends an instant push alert of all low-stock items to Sirii's phone via NTFY"
                >
                  <Bell className="w-3.5 h-3.5 text-atelier-rose500" />
                  <span>{isSendingAlert ? 'Pinging Phone...' : 'Send NTFY Restock Alert'}</span>
                </button>

                <button
                  onClick={handleOpenAdd}
                  className="px-4 py-2 rounded-2xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white text-xs font-semibold shadow-soft transition-all flex items-center gap-2 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Supply Item</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-atelier-champagneBorder/60">
              <span className="text-[11px] font-semibold text-atelier-muted uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>Category:</span>
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    selectedCategory === cat
                      ? 'bg-atelier-rose500 text-white shadow-soft'
                      : 'bg-atelier-cream/60 hover:bg-atelier-cream text-atelier-charcoal border border-atelier-champagneBorder/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Supplies Grid */}
          {filteredInventory.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-atelier-champagneBorder text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-atelier-rose50 text-atelier-rose500 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <p className="font-serif italic font-semibold text-base text-atelier-noir">
                No Supplies Found
              </p>
              <p className="text-xs text-atelier-muted max-w-sm mx-auto">
                No items match your search or filter. Try clearing filters or add a new supply item to your studio inventory.
              </p>
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-atelier-rose500 text-white text-xs font-semibold shadow-soft hover:bg-atelier-rose600"
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
                    className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between shadow-sm hover:shadow-soft ${
                      isOut
                        ? 'border-rose-300 bg-rose-50/20'
                        : isLow
                        ? 'border-amber-300 bg-amber-50/20'
                        : 'border-atelier-champagneBorder hover:border-atelier-rose200'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top: Category & Status */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-atelier-cream border border-atelier-champagneBorder text-atelier-charcoal">
                          {item.category}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                            isOut
                              ? 'bg-rose-100 text-rose-700 border-rose-200'
                              : isLow
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {isLow && <AlertTriangle className="w-2.5 h-2.5" />}
                          <span>{item.status || (isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock')}</span>
                        </span>
                      </div>

                      {/* Name & SKU */}
                      <div>
                        <h4 className="font-serif italic font-bold text-base text-atelier-noir leading-snug">
                          {item.name}
                        </h4>
                        {item.sku && (
                          <span className="font-mono text-[10px] text-atelier-muted">
                            SKU: {item.sku}
                          </span>
                        )}
                      </div>

                      {/* Notes / Description */}
                      {item.notes && (
                        <p className="text-xs text-atelier-muted leading-relaxed line-clamp-2">
                          {item.notes}
                        </p>
                      )}

                      {/* Meta Info: Supplier & Location */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-atelier-champagneBorder/60 text-[11px]">
                        <div>
                          <span className="text-atelier-muted block">Supplier</span>
                          <span className="font-semibold text-atelier-noir truncate block">
                            {item.supplier || 'Standard Supplier'}
                          </span>
                        </div>
                        <div>
                          <span className="text-atelier-muted block">Location</span>
                          <span className="font-semibold text-atelier-noir truncate block">
                            {item.location || 'Studio Storage'}
                          </span>
                        </div>
                      </div>

                      {/* Financial info */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-atelier-cream/40 p-2.5 rounded-xl border border-atelier-champagneBorder/40">
                        <div>
                          <span className="text-atelier-muted block">Cost / Unit</span>
                          <span className="font-semibold font-serif text-atelier-noir">
                            ₹{Number(item.costPerUnit || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-atelier-muted block">Min Threshold</span>
                          <span className="font-semibold text-atelier-noir">
                            {item.minThreshold} {item.unit}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Stock Adjuster & Actions */}
                    <div className="pt-4 mt-4 border-t border-atelier-champagneBorder/60 flex items-center justify-between gap-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center gap-2 bg-atelier-cream/80 p-1 rounded-2xl border border-atelier-champagneBorder">
                        <button
                          onClick={() => onAdjustStock(item.id, -1, true)}
                          disabled={item.quantity <= 0}
                          className="w-7 h-7 rounded-xl bg-white hover:bg-rose-50 text-atelier-charcoal hover:text-rose-600 flex items-center justify-center transition-all disabled:opacity-40 active:scale-95 shadow-xs"
                          title="Reduce stock by 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <div className="px-2 text-center min-w-[50px]">
                          <span className="font-bold text-xs text-atelier-noir block">
                            {item.quantity}
                          </span>
                          <span className="text-[9px] text-atelier-muted block -mt-0.5">
                            {item.unit}
                          </span>
                        </div>

                        <button
                          onClick={() => onAdjustStock(item.id, 1, false)}
                          className="w-7 h-7 rounded-xl bg-white hover:bg-emerald-50 text-atelier-charcoal hover:text-emerald-600 flex items-center justify-center transition-all active:scale-95 shadow-xs"
                          title="Add 1 to stock"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Edit & Delete actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="w-8 h-8 rounded-xl bg-atelier-cream/60 hover:bg-atelier-rose50 text-atelier-muted hover:text-atelier-rose600 flex items-center justify-center transition-all"
                          title="Edit supply details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="w-8 h-8 rounded-xl bg-atelier-cream/60 hover:bg-rose-50 text-atelier-muted hover:text-rose-600 flex items-center justify-center transition-all"
                          title="Delete supply item"
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
          <div className="bg-gradient-to-br from-emerald-50/80 via-white to-atelier-blush rounded-3xl p-6 border border-emerald-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                <span>OSHA & Board of Cosmetology Compliant</span>
              </div>
              <h3 className="font-serif italic font-bold text-xl text-atelier-noir">
                Daily Studio Sterilization & Hygiene Protocol
              </h3>
              <p className="text-xs text-atelier-muted leading-relaxed">
                Nails by Sirii enforces autoclave medical sterilization, 24-hr Barbicide immersion, and HEPA air filtration for client safety.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onResetChecklist}
                className="px-4 py-2.5 rounded-2xl bg-white border border-atelier-champagneBorder hover:border-atelier-rose300 text-atelier-charcoal text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
                title="Resets today's checklist items to uncompleted for the morning opening shift"
              >
                <RefreshCw className="w-3.5 h-3.5 text-atelier-rose500" />
                <span>Reset for New Day</span>
              </button>
            </div>
          </div>

          {/* Opening Shift Protocols */}
          <div className="bg-white rounded-3xl p-6 border border-atelier-champagneBorder shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-atelier-champagneBorder/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-atelier-rose100 text-atelier-rose600 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-serif italic font-bold text-base text-atelier-noir">
                    Morning Opening Protocols
                  </h4>
                  <span className="text-[10px] text-atelier-muted">
                    Must be inspected prior to the first client booking
                  </span>
                </div>
              </div>

              <span className="text-xs font-semibold text-atelier-rose600">
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
                      : 'bg-atelier-cream/30 border-atelier-champagneBorder/80 hover:border-atelier-rose300'
                  }`}
                >
                  <div className="mt-0.5">
                    {item.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-atelier-muted hover:text-atelier-rose500 transition-colors" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${item.completed ? 'text-atelier-noir line-through opacity-80' : 'text-atelier-noir'}`}>
                          {item.title}
                        </span>
                        {item.mandatory && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[9px] font-bold">
                            Mandatory
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-atelier-muted uppercase tracking-wider px-2 py-0.5 rounded bg-atelier-cream border border-atelier-champagneBorder/60">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-atelier-muted leading-relaxed">
                      {item.description}
                    </p>

                    {item.completed && item.completedAt && (
                      <div className="pt-1 flex items-center gap-2 text-[10px] text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified by {item.signedBy || 'Sirii'} at {new Date(item.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evening Closing Protocols */}
          <div className="bg-white rounded-3xl p-6 border border-atelier-champagneBorder shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-atelier-champagneBorder/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-atelier-champagne text-atelier-gold flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-serif italic font-bold text-base text-atelier-noir">
                    Evening Closing & Sterilization Cycle
                  </h4>
                  <span className="text-[10px] text-atelier-muted">
                    Completed at the conclusion of studio service hours
                  </span>
                </div>
              </div>

              <span className="text-xs font-semibold text-atelier-charcoal">
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
                      : 'bg-atelier-cream/30 border-atelier-champagneBorder/80 hover:border-atelier-rose300'
                  }`}
                >
                  <div className="mt-0.5">
                    {item.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-atelier-muted hover:text-atelier-rose500 transition-colors" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${item.completed ? 'text-atelier-noir line-through opacity-80' : 'text-atelier-noir'}`}>
                          {item.title}
                        </span>
                        {item.mandatory && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[9px] font-bold">
                            Mandatory
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-atelier-muted uppercase tracking-wider px-2 py-0.5 rounded bg-atelier-cream border border-atelier-champagneBorder/60">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-atelier-muted leading-relaxed">
                      {item.description}
                    </p>

                    {item.completed && item.completedAt && (
                      <div className="pt-1 flex items-center gap-2 text-[10px] text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-atelier-noir/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 border-t sm:border border-atelier-champagneBorder shadow-xl relative max-h-[92vh] overflow-y-auto">
            <div className="w-10 h-1.5 rounded-full bg-stone-300 mx-auto mb-3 sm:hidden" />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 sm:right-5 top-4 sm:top-5 w-8 h-8 rounded-full bg-atelier-cream flex items-center justify-center text-atelier-muted hover:text-atelier-noir transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-rose600">
                Studio Inventory Catalog
              </span>
              <h3 className="font-serif italic font-bold text-xl text-atelier-noir">
                {editingItem ? 'Edit Supply Item' : 'Add New Supply Item'}
              </h3>
              <p className="text-xs text-atelier-muted">
                Save stock quantities, supplier info, and minimum restock thresholds.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-atelier-charcoal mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apres Gel-X Natural Coffin (Medium)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder focus:outline-none focus:border-atelier-rose400 text-base sm:text-xs text-atelier-noir"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-atelier-charcoal mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-atelier-champagneBorder focus:outline-none focus:border-atelier-rose400 text-base sm:text-xs text-atelier-noir bg-white"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-atelier-charcoal mb-1">
                    SKU / Product Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. APX-NC-MED"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-atelier-champagneBorder focus:outline-none focus:border-atelier-rose400 text-base sm:text-xs text-atelier-noir font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-atelier-charcoal mb-1">
                    Current Qty *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-atelier-champagneBorder focus:outline-none focus:border-atelier-rose400 text-base sm:text-xs text-atelier-noir"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-atelier-charcoal mb-1">
                    Min Threshold *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.minThreshold}
                    onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-atelier-champagneBorder focus:outline-none focus:border-atelier-rose400 text-base sm:text-xs text-atelier-noir"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-atelier-charcoal mb-1">
                    Unit Description
                  </label>
                  <input
                    type="text"
                    placeholder="bottle, box, pack"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-atelier-champagneBorder focus:outline-none focus:border-atelier-rose400 text-base sm:text-xs text-atelier-noir"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-atelier-charcoal mb-1">
                    Cost per Unit (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.costPerUnit}
                    onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-atelier-champagneBorder focus:outline-none focus:border-atelier-rose400 text-base sm:text-xs text-atelier-noir"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-atelier-charcoal mb-1">
                    Retail Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Optional for retail goods"
                    value={formData.retailPrice}
                    onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-atelier-champagneBorder focus:outline-none focus:border-atelier-rose400 text-base sm:text-xs text-atelier-noir"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-atelier-charcoal mb-1">
                    Supplier / Brand
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The GelBottle, Apres"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-atelier-champagneBorder focus:outline-none focus:border-atelier-rose400 text-base sm:text-xs text-atelier-noir"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-atelier-charcoal mb-1">
                    Storage Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Station 1, Drawer B-2"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-atelier-champagneBorder focus:outline-none focus:border-atelier-rose400 text-base sm:text-xs text-atelier-noir"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-atelier-charcoal mb-1">
                  Item Notes & Usage Details
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Best seller for bridal sets, requires dry Russian prep"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-atelier-champagneBorder focus:outline-none focus:border-atelier-rose400 text-base sm:text-xs text-atelier-noir resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-atelier-champagneBorder/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-atelier-champagneBorder hover:bg-atelier-cream text-xs font-semibold text-atelier-charcoal transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white text-xs font-semibold shadow-soft transition-all active:scale-95"
                >
                  {editingItem ? 'Save Changes' : 'Create Supply Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


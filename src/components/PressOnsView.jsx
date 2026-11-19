import React, { useState } from 'react';
import {
  ShoppingBag,
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Edit2,
  Trash2,
  X,
  Check,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  Tag,
  DollarSign,
  Heart,
  Upload,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import NailTipSchematic from './NailTipSchematic';
import ModalPortal from './ModalPortal';
import { SHAPES, LENGTHS, BASE_COLORS, FINISHES } from '../utils/customizerCalculator';

export default function PressOnsView({
  products = [],
  orders = [],
  settings,
  onRefreshProducts,
  onRefreshOrders,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrder,
  onDeleteOrder,
  onAddToast
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products'
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Modals
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState(null);
  const [dispatchForm, setDispatchForm] = useState({
    fulfillmentStatus: 'Shipped',
    courierPartner: 'Delhivery',
    trackingNumber: '',
    paymentStatus: 'Paid (UPI)'
  });

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    collection: 'Signature Boutique',
    shape: 'Almond',
    length: 'Medium',
    baseColor: '#FDF2F8',
    finish: 'Hailey Glazed Chrome',
    price: 1299,
    stock: 5,
    tag: 'Handcrafted',
    isAvailable: true,
    imageUrl: '/catalogue/glazed-donut.jpg',
    description: '',
    includedKit: '10 Handcrafted Nails, Salon Liquid Glue, 24 Jelly Sticky Tabs, Cuticle Pusher, Mini Buffer, 2 Prep Wipes'
  });

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => {
    return o.paymentStatus?.includes('Paid') ? sum + (Number(o.totalAmount) || 0) : sum;
  }, 0);
  const activeOrdersCount = orders.filter(o => o.fulfillmentStatus !== 'Delivered' && o.fulfillmentStatus !== 'Cancelled').length;
  const totalStockCount = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  const lowStockCount = products.filter(p => (Number(p.stock) || 0) <= 3).length;

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const q = orderSearchQuery.toLowerCase();
    const matchesSearch =
      (order.clientName || '').toLowerCase().includes(q) ||
      (order.clientPhone || '').toLowerCase().includes(q) ||
      (order.orderNumber || '').toLowerCase().includes(q) ||
      (order.productTitle || '').toLowerCase().includes(q) ||
      (order.addressCity || '').toLowerCase().includes(q);

    const matchesStatus =
      orderStatusFilter === 'All' ||
      order.fulfillmentStatus === orderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Filtered Products
  const filteredProducts = products.filter((product) => {
    const q = productSearchQuery.toLowerCase();
    return (
      (product.title || '').toLowerCase().includes(q) ||
      (product.collection || '').toLowerCase().includes(q) ||
      (product.shape || '').toLowerCase().includes(q) ||
      (product.tag || '').toLowerCase().includes(q)
    );
  });

  // Open Dispatch Modal
  const handleOpenDispatch = (order) => {
    setSelectedOrderForDispatch(order);
    setDispatchForm({
      fulfillmentStatus: order.fulfillmentStatus || 'Shipped',
      courierPartner: order.courierPartner || 'Delhivery',
      trackingNumber: order.trackingNumber || '',
      paymentStatus: order.paymentStatus || 'Paid (UPI)'
    });
  };

  // Submit Dispatch Update
  const handleSaveDispatch = async (e) => {
    e.preventDefault();
    if (!selectedOrderForDispatch) return;

    try {
      await onUpdateOrder(selectedOrderForDispatch.id, dispatchForm);
      if (onAddToast) {
        onAddToast('Order Updated', `Order #${selectedOrderForDispatch.orderNumber} marked as ${dispatchForm.fulfillmentStatus}.`, 'success');
      }
      setSelectedOrderForDispatch(null);
      if (onRefreshOrders) onRefreshOrders();
    } catch (err) {
      if (onAddToast) {
        onAddToast('Update Failed', err.message || 'Could not update order.', 'error');
      }
    }
  };

  // WhatsApp Dispatch Message
  const getWhatsAppDispatchUrl = (order) => {
    const cleanPhone = (order.clientPhone || '').replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const text = `*Nails by Sirii: Order Dispatch Update*\n\nHello ${order.clientName}!\n\nYour handcrafted press-on nail set *"${order.productTitle}"* (Size: ${order.size}) has been dispatched.\n\n• *Order ID:* ${order.orderNumber}\n• *Courier Partner:* ${order.courierPartner || 'Standard Courier'}\n• *Tracking No:* ${order.trackingNumber || 'In transit'}\n• *Delivery Address:* ${order.addressStreet}, ${order.addressCity}\n\nEvery set includes your complete prep kit (salon liquid glue, jelly sticky tabs, cuticle pusher, and mini buffer). Let us know once your package arrives!\n\n- *Simran (Sirii), Nails by Sirii Atelier*`;
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
  };

  // Open Edit Product
  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      title: prod.title || '',
      collection: prod.collection || 'Signature Boutique',
      shape: prod.shape || 'Almond',
      length: prod.length || 'Medium',
      baseColor: prod.baseColor || '#FDF2F8',
      finish: prod.finish || 'Hailey Glazed Chrome',
      price: prod.price || 1299,
      stock: prod.stock !== undefined ? prod.stock : 5,
      tag: prod.tag || 'Handcrafted',
      isAvailable: prod.isAvailable !== undefined ? prod.isAvailable : true,
      imageUrl: prod.imageUrl || '/catalogue/glazed-donut.jpg',
      description: prod.description || '',
      includedKit: prod.includedKit || '10 Handcrafted Nails, Salon Liquid Glue, 24 Jelly Sticky Tabs, Cuticle Pusher, Mini Buffer, 2 Prep Wipes'
    });
    setIsAddProductModalOpen(true);
  };

  // Open Add Product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      collection: 'Signature Boutique',
      shape: 'Almond',
      length: 'Medium',
      baseColor: '#FDF2F8',
      finish: 'Hailey Glazed Chrome',
      price: 1299,
      stock: 5,
      tag: 'Handcrafted',
      isAvailable: true,
      imageUrl: '/catalogue/glazed-donut.jpg',
      description: '',
      includedKit: '10 Handcrafted Nails, Salon Liquid Glue, 24 Jelly Sticky Tabs, Cuticle Pusher, Mini Buffer, 2 Prep Wipes'
    });
    setIsAddProductModalOpen(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.title.trim()) {
      if (onAddToast) onAddToast('Missing Title', 'Please enter a product title.', 'error');
      return;
    }

    try {
      if (editingProduct) {
        await onUpdateProduct(editingProduct.id, productForm);
        if (onAddToast) onAddToast('Product Updated', `"${productForm.title}" updated successfully.`, 'success');
      } else {
        await onCreateProduct(productForm);
        if (onAddToast) onAddToast('Product Created', `"${productForm.title}" added to boutique catalog.`, 'success');
      }
      setIsAddProductModalOpen(false);
      setEditingProduct(null);
      if (onRefreshProducts) onRefreshProducts();
    } catch (err) {
      if (onAddToast) onAddToast('Error', err.message || 'Failed to save product.', 'error');
    }
  };

  // Quick Stock Adjust
  const handleQuickStockAdjust = async (product, delta) => {
    const newStock = Math.max(0, (Number(product.stock) || 0) + delta);
    try {
      await onUpdateProduct(product.id, {
        ...product,
        stock: newStock,
        isAvailable: newStock > 0
      });
      if (onRefreshProducts) onRefreshProducts();
    } catch (err) {
      if (onAddToast) onAddToast('Error', 'Failed to update stock.', 'error');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP HEADER & OVERVIEW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-wine">
              E-Commerce Boutique
            </span>
            <Heart className="w-2.5 h-2.5 text-brand-wine fill-brand-wine shrink-0" />
            <span className="text-xs text-text-muted font-medium">Ready-to-Wear Press-Ons</span>
          </div>
          <h1 className="font-display italic font-bold text-2xl sm:text-3xl text-text-ink mt-0.5">
            Press-On Nails Management
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Manage your online press-on nail orders, shipping logistics, product catalog, and stock.
          </p>
        </div>

        {/* Tab Switcher & Add Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex bg-studio-surface border border-border-subtle p-1 rounded-2xl shadow-xs text-xs font-semibold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-brand-wine text-white shadow-xs'
                  : 'text-text-muted hover:text-text-ink'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Orders ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'bg-brand-wine text-white shadow-xs'
                  : 'text-text-muted hover:text-text-ink'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Boutique Catalog ({products.length})</span>
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 rounded-2xl bg-brand-wine hover:bg-brand-wineHover text-white text-xs font-semibold shadow-studio transition-all active:scale-95 flex items-center gap-1.5 min-h-[40px]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Press-On Set</span>
              <span className="sm:hidden">New</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-studio-surface p-4 rounded-3xl border border-border-subtle shadow-studio space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-medium">Press-On Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="font-display italic font-bold text-xl sm:text-2xl text-text-ink">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-text-muted">Paid client orders</div>
        </div>

        <div className="bg-studio-surface p-4 rounded-3xl border border-border-subtle shadow-studio space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-medium">Orders to Fulfill</span>
            <ShoppingBag className="w-4 h-4 text-brand-wine" />
          </div>
          <div className="font-display italic font-bold text-xl sm:text-2xl text-text-ink">
            {activeOrdersCount}
          </div>
          <div className="text-[10px] text-brand-wine font-medium">Need packaging / shipping</div>
        </div>

        <div className="bg-studio-surface p-4 rounded-3xl border border-border-subtle shadow-studio space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-medium">Ready Stock Units</span>
            <Package className="w-4 h-4 text-purple-700" />
          </div>
          <div className="font-display italic font-bold text-xl sm:text-2xl text-text-ink">
            {totalStockCount} sets
          </div>
          <div className="text-[10px] text-text-muted">Across {products.length} designs</div>
        </div>

        <div className="bg-studio-surface p-4 rounded-3xl border border-border-subtle shadow-studio space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-medium">Low Stock Sets</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-display italic font-bold text-xl sm:text-2xl text-text-ink">
            {lowStockCount}
          </div>
          <div className="text-[10px] text-amber-700 font-medium">Stock ≤ 3 sets remaining</div>
        </div>
      </div>

      {/* 3. TAB 1: CUSTOMER ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Controls: Search and Filter Pills */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar text-xs font-semibold">
              {['All', 'New Order', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    orderStatusFilter === status
                      ? 'bg-brand-wine text-white shadow-xs'
                      : 'bg-studio-surface border border-border-subtle text-text-muted hover:text-text-ink'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative sm:w-64">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, phone, city..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-studio-surface border border-border-subtle rounded-xl text-base sm:text-xs text-text-ink focus:outline-none focus:border-brand-wine"
              />
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-studio-surface rounded-3xl border border-border-subtle p-8 text-center space-y-3 shadow-studio">
              <ShoppingBag className="w-10 h-10 text-text-muted mx-auto" />
              <h3 className="font-display italic font-bold text-lg text-text-ink">
                No orders match your filter
              </h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                Orders placed by clients through your public website's Press-On store will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredOrders.map((order) => {
                const isPaid = order.paymentStatus?.includes('Paid');
                return (
                  <div
                    key={order.id}
                    className="bg-studio-surface rounded-3xl border border-border-subtle p-5 shadow-studio hover:border-brand-wine/30 transition-all space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-studio-canvas border border-border-subtle flex items-center justify-center text-brand-wine shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-text-ink text-sm">
                              #{order.orderNumber}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              order.fulfillmentStatus === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : order.fulfillmentStatus === 'Shipped'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : order.fulfillmentStatus === 'Processing'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-studio-canvas text-brand-wine border border-border-subtle'
                            }`}>
                              {order.fulfillmentStatus}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isPaid
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                              {order.paymentStatus || 'Pending UPI'}
                            </span>
                          </div>
                          <p className="text-[11px] text-text-muted">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-display italic font-bold text-lg text-text-ink">
                          ₹{order.totalAmount}
                        </div>
                        <span className="text-[11px] text-text-muted">
                          Qty: {order.quantity || 1} • {order.wearMethod || 'Adhesive Tabs'}
                        </span>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Product & Specifications */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                          Product Ordered
                        </span>
                        <p className="font-semibold text-text-ink">{order.productTitle}</p>
                        <p className="text-[11px] text-text-muted">
                          Shape: <strong>{order.shape}</strong> • Length: <strong>{order.length}</strong>
                        </p>
                        <p className="text-[11px] text-brand-wine font-semibold">
                          Selected Size: {order.size} {order.customSizes ? `(${order.customSizes})` : ''}
                        </p>
                      </div>

                      {/* Client Info */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                          Customer Details
                        </span>
                        <p className="font-semibold text-text-ink">{order.clientName}</p>
                        <p className="text-[11px] text-text-muted">Phone: {order.clientPhone}</p>
                        {order.clientEmail && (
                          <p className="text-[11px] text-text-muted truncate">Email: {order.clientEmail}</p>
                        )}
                      </div>

                      {/* Shipping Address & Courier */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                          Shipping Address
                        </span>
                        <p className="text-[11px] text-text-ink leading-relaxed">
                          {order.addressStreet}, {order.addressCity}, {order.addressState} - {order.addressPincode}
                        </p>
                        {order.trackingNumber ? (
                          <p className="text-[11px] text-blue-700 font-semibold pt-1 flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5" />
                            <span>{order.courierPartner || 'Courier'}: {order.trackingNumber}</span>
                          </p>
                        ) : (
                          <span className="text-[10px] text-amber-700 font-medium pt-1 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Awaiting tracking number</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        {/* WhatsApp Dispatch Link */}
                        <a
                          href={getWhatsAppDispatchUrl(order)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp Update</span>
                        </a>

                        {/* Dispatch / Status Updater */}
                        <button
                          onClick={() => handleOpenDispatch(order)}
                          className="px-3.5 py-1.5 rounded-xl bg-studio-canvas hover:bg-studio-subtle text-text-ink border border-border-subtle font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <Truck className="w-3.5 h-3.5 text-brand-wine" />
                          <span>Update Status & Tracking</span>
                        </button>
                      </div>

                      {/* Delete Order */}
                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete order #${order.orderNumber}?`)) {
                            await onDeleteOrder(order.id);
                            if (onRefreshOrders) onRefreshOrders();
                          }
                        }}
                        className="text-text-muted hover:text-red-700 p-1.5 rounded-lg transition-colors"
                        title="Delete Order Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 2: BOUTIQUE CATALOG & STOCK */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by title, collection, shape..."
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-studio-surface border border-border-subtle rounded-xl text-base sm:text-xs text-text-ink focus:outline-none focus:border-brand-wine"
              />
            </div>

            <span className="text-xs text-text-muted font-medium">
              Showing {filteredProducts.length} of {products.length} designs
            </span>
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="bg-studio-surface rounded-3xl border border-border-subtle p-12 text-center space-y-3 shadow-studio">
              <div className="w-12 h-12 mx-auto rounded-full bg-studio-canvas text-brand-wine flex items-center justify-center border border-border-subtle">
                <Package className="w-6 h-6 text-brand-wine" />
              </div>
              <h3 className="font-display italic font-bold text-lg text-text-ink">
                No Press-On Sets in Boutique Yet
              </h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                Your boutique catalog is empty and ready. Create and publish your handcrafted press-on sets with custom shapes, finishes, prices, and stock counts.
              </p>
              <button
                onClick={handleOpenAddProduct}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-wine text-white text-xs font-semibold shadow-studio hover:bg-brand-wineHover min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Press-On Set</span>
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-studio-surface rounded-3xl border border-border-subtle p-8 text-center space-y-3 shadow-studio">
              <Package className="w-10 h-10 text-text-muted mx-auto" />
              <h3 className="font-display italic font-bold text-lg text-text-ink">
                No sets match your search
              </h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                Try searching for a different shape, collection, or nail style.
              </p>
              <button
                onClick={() => setProductSearchQuery('')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-studio-canvas border border-border-subtle text-xs font-semibold hover:bg-studio-surface"
              >
                <span>Clear Search</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-studio-surface rounded-3xl border border-border-subtle p-5 shadow-studio hover:border-brand-wine/30 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3.5">
                    {/* Real Nail Photography Preview */}
                    <div className="relative h-44 rounded-2xl overflow-hidden bg-studio-canvas border border-border-subtle group-hover:border-brand-wine/30 transition-all">
                      <img
                        src={prod.imageUrl || '/catalogue/glazed-donut.jpg'}
                        alt={prod.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = '/catalogue/glazed-donut.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20 pointer-events-none" />

                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-[10px] font-bold text-white shadow-xs">
                        {prod.tag || 'Handcrafted'}
                      </span>

                      <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-brand-wine/90 backdrop-blur-md text-[10px] font-bold text-white shadow-xs">
                        {prod.shape} • {prod.length}
                      </span>
                    </div>

                    {/* Title & Collection */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-wine block">
                        {prod.collection || 'Signature Boutique'}
                      </span>
                      <h3 className="font-display italic font-bold text-base text-text-ink group-hover:text-brand-wine transition-colors">
                        {prod.title}
                      </h3>
                      <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    {/* Price & Stock Controls */}
                    <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-text-muted block">Price</span>
                        <span className="font-display italic font-bold text-base text-text-ink">
                          ₹{prod.price}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-text-muted block">Inventory Stock</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <button
                            onClick={() => handleQuickStockAdjust(prod, -1)}
                            className="w-6 h-6 rounded-lg bg-studio-canvas border border-border-subtle text-text-ink font-bold hover:bg-studio-subtle flex items-center justify-center"
                            title="Reduce stock by 1"
                          >
                            -
                          </button>
                          <span className={`font-bold px-2 text-xs ${
                            prod.stock <= 3 ? 'text-amber-700' : 'text-text-ink'
                          }`}>
                            {prod.stock}
                          </span>
                          <button
                            onClick={() => handleQuickStockAdjust(prod, 1)}
                            className="w-6 h-6 rounded-lg bg-studio-canvas border border-border-subtle text-text-ink font-bold hover:bg-studio-subtle flex items-center justify-center"
                            title="Increase stock by 1"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Edit & Delete Controls */}
                  <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold ${
                      prod.stock > 0 && prod.isAvailable ? 'text-emerald-700' : 'text-red-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${prod.stock > 0 && prod.isAvailable ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                      {prod.stock > 0 && prod.isAvailable ? 'In Stock (Active)' : 'Out of Stock'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        className="px-3 py-1.5 rounded-xl bg-studio-canvas hover:bg-studio-subtle text-text-ink border border-border-subtle font-semibold flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3 text-brand-wine" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete product "${prod.title}"?`)) {
                            await onDeleteProduct(prod.id);
                            if (onRefreshProducts) onRefreshProducts();
                          }
                        }}
                        className="p-1.5 rounded-xl hover:bg-red-50 text-text-muted hover:text-red-700 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. MODAL: UPDATE DISPATCH / TRACKING */}
      {selectedOrderForDispatch && (
        <ModalPortal isOpen={!!selectedOrderForDispatch} onClose={() => setSelectedOrderForDispatch(null)}>
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-studio-ink/60 backdrop-blur-md animate-in fade-in">
            <div className="bg-studio-surface rounded-3xl max-w-md w-full p-6 shadow-studio-float border border-border-subtle space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-wine" />
                  <h3 className="font-display italic font-bold text-lg text-text-ink">
                    Update Order #{selectedOrderForDispatch.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrderForDispatch(null)}
                  className="w-7 h-7 rounded-full bg-studio-canvas flex items-center justify-center text-text-muted hover:text-text-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveDispatch} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-semibold text-text-ink mb-1">
                    Fulfillment Status
                  </label>
                  <select
                    value={dispatchForm.fulfillmentStatus}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, fulfillmentStatus: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-studio-surface text-base sm:text-xs text-text-ink font-semibold"
                  >
                    <option value="New Order">New Order</option>
                    <option value="Processing">Processing / Handcrafting</option>
                    <option value="Shipped">Shipped / In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-text-ink mb-1">
                    Payment Status
                  </label>
                  <select
                    value={dispatchForm.paymentStatus}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, paymentStatus: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-studio-surface text-base sm:text-xs text-text-ink font-semibold"
                  >
                    <option value="Paid (UPI)">Paid (UPI)</option>
                    <option value="Pending UPI">Pending UPI Verification</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-text-ink mb-1">
                    Courier Partner
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Delhivery, Bluedart, Speed Post"
                    value={dispatchForm.courierPartner}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, courierPartner: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-studio-surface text-base sm:text-xs text-text-ink"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text-ink mb-1">
                    Tracking Number / AWB
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DLV1234567890"
                    value={dispatchForm.trackingNumber}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, trackingNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-studio-surface text-base sm:text-xs text-text-ink font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForDispatch(null)}
                    className="px-4 py-2 rounded-xl border border-border-subtle text-text-muted hover:bg-studio-canvas"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-wine hover:bg-brand-wineHover text-white font-semibold shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* 6. MODAL: ADD / EDIT PRODUCT */}
      {isAddProductModalOpen && (
        <ModalPortal isOpen={isAddProductModalOpen} onClose={() => setIsAddProductModalOpen(false)}>
          <div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsAddProductModalOpen(false)}
          >
            <div
              className="bg-studio-surface rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-studio-float border border-border-subtle space-y-5 my-auto max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-brand-wine" />
                  <h3 className="font-display italic font-bold text-lg text-text-ink">
                    {editingProduct ? 'Edit Press-On Design' : 'Add New Press-On Design'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-studio-canvas flex items-center justify-center text-text-muted hover:text-text-ink min-h-[36px] min-w-[36px]"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-sans">
                {/* 1. Real Photography Image Preview & Controls */}
                <div className="space-y-2">
                  <label className="block font-semibold text-text-ink">
                    Product Photograph *
                  </label>

                  {/* Photo Preview Card */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-studio-canvas border border-border-subtle group">
                    <img
                      src={productForm.imageUrl || '/catalogue/glazed-donut.jpg'}
                      alt="Preview"
                      className="w-full h-full object-cover pointer-events-none"
                      onError={(e) => {
                        e.currentTarget.src = '/catalogue/glazed-donut.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                    
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-[10px] font-bold text-white shadow-xs">
                        {productForm.tag || 'Handcrafted'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-wine/90 backdrop-blur-md text-[10px] font-bold text-white shadow-xs">
                        {productForm.shape} • {productForm.length}
                      </span>
                    </div>

                    {productForm.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setProductForm({ ...productForm, imageUrl: '' })}
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all shadow-xs"
                        title="Clear photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Image URL Input & File Upload */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. /catalogue/glazed-donut.jpg or image URL"
                      value={productForm.imageUrl}
                      onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                      className="flex-1 p-2.5 rounded-xl border border-border-subtle bg-studio-surface text-base sm:text-xs text-text-ink"
                    />
                    <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-studio-canvas hover:bg-studio-subtle border border-border-subtle text-text-ink font-semibold flex items-center gap-1.5 shrink-0 active:scale-95 transition-all">
                      <Upload className="w-3.5 h-3.5 text-brand-wine" />
                      <span className="text-xs">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setProductForm({ ...productForm, imageUrl: ev.target.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Quick Studio Photo Presets */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                      Quick Studio Lookbook Presets
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'Hailey Glazed', url: '/catalogue/glazed-donut.jpg' },
                        { label: 'Velvet Cat-Eye', url: '/catalogue/velvet-cateye.jpg' },
                        { label: '3D Molten Gold', url: '/catalogue/luxe-pearl.jpg' },
                        { label: 'French Ombré', url: '/catalogue/french-ombre.jpg' },
                        { label: 'Milky Quartz', url: '/catalogue/milky-white.jpg' },
                        { label: 'Little Sparkle', url: '/hero/little-sparkle.jpg' },
                        { label: 'Statement Stiletto', url: '/hero/make-statement.jpg' }
                      ].map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => setProductForm({ ...productForm, imageUrl: preset.url })}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                            productForm.imageUrl === preset.url
                              ? 'bg-brand-wine text-white border-brand-wine shadow-xs'
                              : 'bg-studio-canvas hover:bg-studio-subtle text-text-secondary border-border-subtle'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Textual & Inventory Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border-subtle">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-text-ink mb-1">
                      Design Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hailey Glazed Pearl Chrome"
                      value={productForm.title}
                      onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-border-subtle bg-studio-surface text-base sm:text-xs text-text-ink font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-text-ink mb-1">
                      Collection / Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Signature Ethereal"
                      value={productForm.collection}
                      onChange={(e) => setProductForm({ ...productForm, collection: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-border-subtle bg-studio-surface text-base sm:text-xs text-text-ink"
                    />
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {['Signature Ethereal', 'Magnetic Silk', 'Artisan Couture', 'Everyday Minimalist', 'Streetwear Art'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setProductForm({ ...productForm, collection: c })}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-medium border ${
                            productForm.collection === c
                              ? 'bg-brand-wine/10 text-brand-wine border-brand-wine/30'
                              : 'bg-studio-canvas text-text-muted border-border-subtle'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-text-ink mb-1">
                      Badge Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bestseller, Trending"
                      value={productForm.tag}
                      onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-border-subtle bg-studio-surface text-base sm:text-xs text-text-ink"
                    />
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {['Bestseller', 'Studio Pick', 'Luxury Edition', 'Trending', 'Clean Aesthetic', 'Handcrafted'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setProductForm({ ...productForm, tag: t })}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-medium border ${
                            productForm.tag === t
                              ? 'bg-brand-wine/10 text-brand-wine border-brand-wine/30'
                              : 'bg-studio-canvas text-text-muted border-border-subtle'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-text-ink mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-border-subtle bg-studio-surface text-base sm:text-xs text-text-ink font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-text-ink mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-border-subtle bg-studio-surface text-base sm:text-xs text-text-ink font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-text-ink mb-1">
                      Nail Shape
                    </label>
                    <select
                      value={productForm.shape}
                      onChange={(e) => setProductForm({ ...productForm, shape: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-border-subtle bg-studio-surface text-base sm:text-xs text-text-ink"
                    >
                      {SHAPES.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-text-ink mb-1">
                      Nail Length
                    </label>
                    <select
                      value={productForm.length}
                      onChange={(e) => setProductForm({ ...productForm, length: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-border-subtle bg-studio-surface text-base sm:text-xs text-text-ink"
                    >
                      {LENGTHS.map(l => (
                        <option key={l.id} value={l.name}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-text-ink mb-1">
                    Design Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe the aesthetic, chrome powder, 3D art, or inspiration..."
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-studio-surface text-base sm:text-xs text-text-ink leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text-ink mb-1">
                    What's Included in Box
                  </label>
                  <input
                    type="text"
                    value={productForm.includedKit}
                    onChange={(e) => setProductForm({ ...productForm, includedKit: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-studio-surface text-base sm:text-xs text-text-ink"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={productForm.isAvailable}
                    onChange={(e) => setProductForm({ ...productForm, isAvailable: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-wine accent-brand-wine cursor-pointer"
                  />
                  <label htmlFor="isAvailable" className="font-semibold text-text-ink cursor-pointer">
                    Available for purchase on client website
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
                  <button
                    type="button"
                    onClick={() => setIsAddProductModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-border-subtle text-text-muted hover:bg-studio-canvas font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-brand-wine hover:bg-brand-wineHover text-white font-semibold shadow-xs active:scale-95 transition-all"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
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

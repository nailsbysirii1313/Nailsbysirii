import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Clock,
  DollarSign,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  Star,
  Tag
} from 'lucide-react';

export default function ServicesView({
  services = [],
  onSaveService,
  onDeleteService
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Natural Nails',
    duration: 60,
    price: 80,
    description: '',
    popular: false
  });

  const categories = ['ALL', 'Natural Nails', 'Extensions', 'Nail Art', 'Add-on', 'Pedicure', 'Removal'];

  const filtered = services.filter((s) =>
    categoryFilter === 'ALL' ? true : s.category === categoryFilter
  );

  const handleOpenModal = (service = null) => {
    if (service) {
      setServiceToEdit(service);
      setFormData({
        name: service.name,
        category: service.category,
        duration: service.duration,
        price: service.price,
        description: service.description || '',
        popular: Boolean(service.popular)
      });
    } else {
      setServiceToEdit(null);
      setFormData({
        name: '',
        category: 'Natural Nails',
        duration: 60,
        price: 2200,
        description: '',
        popular: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSaveService({
      ...(serviceToEdit ? { id: serviceToEdit.id } : {}),
      name: formData.name.trim(),
      category: formData.category,
      duration: Number(formData.duration) || 60,
      price: Number(formData.price) || 0,
      description: formData.description.trim(),
      popular: formData.popular
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-subtle text-brand-wine text-xs font-semibold mb-2 border border-border-subtle">
            <Sparkles className="w-3.5 h-3.5 text-brand-wine" />
            <span>Studio Menu & Art Catalog</span>
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-text-ink tracking-tight">
            Services & Art Menu
          </h2>
          <p className="text-xs text-text-muted mt-1 max-w-xl">
            Configure your studio treatment menu, honest appointment durations, and bespoke hand-painted nail art pricing tiers.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal(null)}
          className="px-4 py-2.5 rounded-2xl bg-brand-wine hover:bg-brand-wineHover text-white text-xs font-semibold shadow-studio transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0 min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap min-h-[38px] ${
              categoryFilter === cat
                ? 'bg-brand-wine text-white shadow-studio font-bold'
                : 'bg-studio-surface text-text-secondary border border-border-subtle hover:bg-studio-canvas'
            }`}
          >
            {cat === 'ALL' ? 'All Services' : cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {filtered.length === 0 ? (
        <div className="bg-studio-surface rounded-3xl p-12 border border-border-subtle text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-full bg-studio-canvas text-brand-wine flex items-center justify-center border border-border-subtle">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="font-display font-semibold text-lg text-text-ink">
            No Services in this Category
          </p>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            Add a service to this category to display it in your studio menu and public booking wizard.
          </p>
          <button
            onClick={() => handleOpenModal(null)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-wine text-white text-xs font-semibold hover:bg-brand-wineHover shadow-studio min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((srv) => (
            <div
              key={srv.id}
              className="bg-studio-surface rounded-3xl p-5 border border-border-subtle hover:border-border-strong shadow-xs hover:shadow-studio transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-studio-canvas text-brand-wine border border-border-subtle uppercase tracking-wider">
                    {srv.category}
                  </span>
                  {srv.popular && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>Popular</span>
                    </span>
                  )}
                </div>

                <h3 className="font-display font-semibold text-base text-text-ink">
                  {srv.name}
                </h3>

                <p className="text-xs text-text-muted mt-2 leading-relaxed">
                  {srv.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border-subtle flex items-center justify-between">
                <div>
                  <span className="font-display font-bold text-xl text-text-ink">
                    ₹{Number(srv.price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-text-muted block">
                    {srv.duration} minutes
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenModal(srv)}
                    className="p-2.5 rounded-xl hover:bg-studio-canvas text-text-muted hover:text-text-ink transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center border border-border-subtle"
                    title="Edit Service"
                    aria-label="Edit service"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteService(srv.id)}
                    className="p-2.5 rounded-xl hover:bg-rose-50 text-text-muted hover:text-rose-600 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center border border-border-subtle"
                    title="Delete Service"
                    aria-label="Delete service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-ink/60 backdrop-blur-sm">
          <div className="bg-studio-surface rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-studio border border-border-subtle relative font-sans">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-text-muted hover:text-text-ink hover:bg-studio-canvas transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-semibold text-xl text-text-ink mb-4">
              {serviceToEdit ? 'Edit Service' : 'Add New Service'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Signature BIAB / Builder Gel Manicure"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas outline-none focus:border-brand-wine focus:bg-white text-base sm:text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas outline-none text-base sm:text-xs font-medium"
                  >
                    <option value="Natural Nails">Natural Nails</option>
                    <option value="Extensions">Extensions</option>
                    <option value="Nail Art">Nail Art</option>
                    <option value="Add-on">Add-on</option>
                    <option value="Pedicure">Pedicure</option>
                    <option value="Removal">Removal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-text-secondary mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas outline-none focus:border-brand-wine focus:bg-white text-base sm:text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Duration (Minutes) *
                </label>
                <input
                  type="number"
                  min="15"
                  step="5"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas outline-none focus:border-brand-wine focus:bg-white text-base sm:text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Detailed description of the treatment technique, included prep, or durability..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas outline-none focus:border-brand-wine focus:bg-white text-base sm:text-xs resize-none"
                />
              </div>

              <div className="flex items-center pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-wine focus:ring-brand-wine border-border-subtle accent-brand-wine"
                  />
                  <span className="font-semibold text-text-ink text-xs">
                    Mark as Popular Service (Highlighted on website)
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border-subtle text-text-secondary text-xs font-semibold hover:bg-studio-canvas min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-wine hover:bg-brand-wineHover text-white text-xs font-semibold shadow-studio transition-all active:scale-95 min-h-[44px]"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

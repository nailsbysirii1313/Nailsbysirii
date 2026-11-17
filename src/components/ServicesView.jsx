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
  Star
} from 'lucide-react';

export default function ServicesView({
  services,
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
        price: 80,
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
      name: formData.name,
      category: formData.category,
      duration: Number(formData.duration) || 60,
      price: Number(formData.price) || 0,
      description: formData.description,
      popular: formData.popular
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif italic font-bold text-2xl text-atelier-noir">
            Services & Nail Art Menu
          </h2>
          <p className="text-xs text-atelier-muted">
            Configure your studio service catalog, durations, and cute nail art pricing tiers.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal(null)}
          className="px-4 py-2.5 rounded-2xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white text-xs font-semibold shadow-soft transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
              categoryFilter === cat
                ? 'bg-atelier-rose500 text-white shadow-sm'
                : 'bg-white text-atelier-charcoal border border-atelier-champagneBorder hover:bg-atelier-cream'
            }`}
          >
            {cat === 'ALL' ? 'All Services' : cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-3xl p-5 border border-atelier-champagneBorder hover:border-atelier-rose300 shadow-sm hover:shadow-soft transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-atelier-rose50 text-atelier-rose600 border border-atelier-rose200/60 uppercase tracking-wider">
                  {srv.category}
                </span>
                {srv.popular && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>Popular</span>
                  </span>
                )}
              </div>

              <h3 className="font-serif italic font-bold text-base text-atelier-noir">
                {srv.name}
              </h3>

              <p className="text-xs text-atelier-muted mt-2 leading-relaxed">
                {srv.description || 'No description provided.'}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-atelier-champagneBorder/60 flex items-center justify-between">
              <div>
                <span className="font-serif italic font-bold text-xl text-atelier-noir">
                  ₹{Number(srv.price).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-atelier-muted block">
                  {srv.duration} minutes
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenModal(srv)}
                  className="p-1.5 rounded-xl hover:bg-atelier-cream text-atelier-muted hover:text-atelier-noir transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteService(srv.id)}
                  className="p-1.5 rounded-xl hover:bg-red-50 text-atelier-muted hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-atelier-noir/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-float border border-atelier-champagneBorder relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-atelier-muted hover:text-atelier-noir hover:bg-atelier-cream transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif italic font-bold text-xl text-atelier-noir mb-4">
              {serviceToEdit ? 'Edit Service' : 'Add New Service'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-atelier-charcoal mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cute 3D Gel Art & Bows"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder outline-none focus:border-atelier-rose400 text-base sm:text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-atelier-charcoal mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder bg-white outline-none text-base sm:text-xs"
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
                  <label className="block font-semibold text-atelier-charcoal mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder outline-none text-base sm:text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-atelier-charcoal mb-1">
                  Duration (Minutes) *
                </label>
                <input
                  type="number"
                  min="15"
                  step="5"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder outline-none text-base sm:text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-atelier-charcoal mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the treatment or technique..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder outline-none text-base sm:text-xs"
                />
              </div>

              <div className="flex items-center pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="w-4 h-4 rounded text-atelier-rose500 focus:ring-atelier-rose400 border-atelier-champagneBorder accent-atelier-rose500"
                  />
                  <span className="font-semibold text-atelier-noir">
                    Mark as Popular Service
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-atelier-champagneBorder">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-atelier-champagneBorder text-atelier-charcoal text-xs font-semibold hover:bg-atelier-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white text-xs font-semibold shadow-soft"
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


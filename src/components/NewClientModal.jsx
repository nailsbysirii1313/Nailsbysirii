import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { InstagramIcon } from './Icons';

export default function NewClientModal({ isOpen, onClose, onSave, clientToEdit }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    instagram: '',
    preferredShape: 'Medium Almond',
    preferredLength: 'Medium',
    preferredAesthetic: '3D Chrome & Glaze',
    allergies: 'None reported',
    birthday: '',
    notes: '',
    vip: false
  });

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        name: clientToEdit.name || '',
        phone: clientToEdit.phone || '',
        email: clientToEdit.email || '',
        instagram: clientToEdit.instagram || '',
        preferredShape: clientToEdit.preferredShape || 'Medium Almond',
        preferredLength: clientToEdit.preferredLength || 'Medium',
        preferredAesthetic: clientToEdit.preferredAesthetic || '3D Chrome & Glaze',
        allergies: clientToEdit.allergies || 'None reported',
        birthday: clientToEdit.birthday || '',
        notes: clientToEdit.notes || '',
        vip: Boolean(clientToEdit.vip)
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        instagram: '',
        preferredShape: 'Medium Almond',
        preferredLength: 'Medium',
        preferredAesthetic: '3D Chrome & Glaze',
        allergies: 'None reported',
        birthday: '',
        notes: '',
        vip: false
      });
    }
  }, [clientToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please provide at least client name and phone number.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-atelier-noir/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full p-5 sm:p-8 shadow-float border-t sm:border border-atelier-champagneBorder relative max-h-[92vh] overflow-y-auto">
        <div className="w-10 h-1.5 rounded-full bg-stone-300 mx-auto mb-3 sm:hidden" />
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full text-atelier-muted hover:text-atelier-noir hover:bg-atelier-cream transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-atelier-rose100 text-atelier-rose600 text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5" />
            <span>{clientToEdit ? 'Update Profile' : 'New Client Profile'}</span>
          </div>
          <h3 className="font-serif italic font-bold text-2xl text-atelier-noir">
            {clientToEdit ? 'Edit Client Details' : 'Register New Client'}
          </h3>
          <p className="text-xs text-atelier-muted mt-1">
            Store essential client preferences, nail anatomy notes, and contact details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1.5">
                Client Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mia Sterling"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none transition-all text-base sm:text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1.5">
                Phone Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none transition-all text-base sm:text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. client@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none transition-all text-base sm:text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1.5">
                Instagram Handle
              </label>
              <input
                type="text"
                placeholder="e.g. @miasterling"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none transition-all text-base sm:text-xs"
              />
            </div>
          </div>

          {/* Nail Preferences */}
          <div className="pt-2 border-t border-atelier-champagneBorder/60">
            <h4 className="font-semibold text-atelier-noir text-xs mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-atelier-rose500" />
              <span>Nail Anatomy & Style Preferences</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-atelier-muted mb-1">
                  Preferred Shape
                </label>
                <select
                  value={formData.preferredShape}
                  onChange={(e) => setFormData({ ...formData, preferredShape: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
                >
                  <option value="Short Round">Short Round</option>
                  <option value="Short Squoval">Short Squoval</option>
                  <option value="Medium Almond">Medium Almond</option>
                  <option value="Long Almond">Long Almond</option>
                  <option value="Medium Coffin">Medium Coffin</option>
                  <option value="Long Coffin">Long Coffin</option>
                  <option value="Stiletto">Stiletto</option>
                  <option value="Square">Square</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-atelier-muted mb-1">
                  Preferred Length
                </label>
                <select
                  value={formData.preferredLength}
                  onChange={(e) => setFormData({ ...formData, preferredLength: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
                >
                  <option value="Short">Short (Active)</option>
                  <option value="Medium">Medium (Balanced)</option>
                  <option value="Long">Long (Dramatic)</option>
                  <option value="Extra Long">Extra Long (Statement)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-atelier-muted mb-1">
                  Signature Style
                </label>
                <select
                  value={formData.preferredAesthetic}
                  onChange={(e) => setFormData({ ...formData, preferredAesthetic: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
                >
                  <option value="3D Chrome & Glaze">3D Chrome & Glaze</option>
                  <option value="BIAB Natural Look">BIAB Clean Natural</option>
                  <option value="French Ombre Minimalist">French Ombre Minimalist</option>
                  <option value="Velvet Cat Eye">Velvet Cat Eye</option>
                  <option value="Y2K Kawaii 3D Charms">Y2K Kawaii 3D Charms</option>
                  <option value="Hand-Painted Abstract">Hand-Painted Abstract</option>
                  <option value="High Fashion Editorial">High Fashion Editorial</option>
                </select>
              </div>
            </div>
          </div>

          {/* Health & Allergies */}
          <div className="pt-2">
            <label className="block font-semibold text-atelier-charcoal mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-atelier-rose500" />
              <span>Allergies or Nail Sensitivities</span>
            </label>
            <input
              type="text"
              placeholder="e.g. HEMA-free gel only, delicate cuticles, acetone sensitivity"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
            />
          </div>

          {/* Notes & VIP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Client Birthday (for special studio perks)
              </label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
              />
            </div>

            <div className="flex items-center pt-2 sm:pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.vip}
                  onChange={(e) => setFormData({ ...formData, vip: e.target.checked })}
                  className="w-4 h-4 rounded text-atelier-rose500 focus:ring-atelier-rose400 border-atelier-champagneBorder accent-atelier-rose500"
                />
                <span className="font-semibold text-atelier-noir">Designate as VIP Client</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-atelier-charcoal mb-1.5">
              Studio Notes & Favorites
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Prefers matcha latte, books 3 weeks in advance, loves milky pink jelly tones"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-atelier-champagneBorder/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-atelier-champagneBorder text-atelier-charcoal hover:bg-atelier-cream text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white text-xs font-semibold shadow-soft transition-all active:scale-95"
            >
              {clientToEdit ? 'Save Changes' : 'Register Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

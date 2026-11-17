import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Palette, AlertCircle, Heart } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-studio-ink/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-studio-surface rounded-t-3xl sm:rounded-3xl max-w-xl w-full p-5 sm:p-8 shadow-studio-float border-t sm:border border-studio-border relative max-h-[92vh] overflow-y-auto font-sans">
        <div className="w-10 h-1.5 rounded-full bg-studio-borderStrong mx-auto mb-3 sm:hidden" />
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full text-studio-muted hover:text-studio-ink hover:bg-studio-subtle transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-wineLight text-studio-wine text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5" />
            <span>{clientToEdit ? 'Update Profile' : 'New Client Profile'}</span>
          </div>
          <h3 className="font-display italic font-bold text-2xl text-studio-ink">
            {clientToEdit ? 'Edit Client Details' : 'Register New Client'}
          </h3>
          <p className="text-xs text-studio-secondary mt-1">
            Store essential client preferences, nail anatomy notes, and contact details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-studio-secondary mb-1.5">
                Client Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mia Sterling"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none transition-all text-base sm:text-xs text-studio-ink"
              />
            </div>

            <div>
              <label className="block font-semibold text-studio-secondary mb-1.5">
                Phone Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none transition-all text-base sm:text-xs text-studio-ink"
              />
            </div>

            <div>
              <label className="block font-semibold text-studio-secondary mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. client@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none transition-all text-base sm:text-xs text-studio-ink"
              />
            </div>

            <div>
              <label className="block font-semibold text-studio-secondary mb-1.5">
                Instagram Handle
              </label>
              <input
                type="text"
                placeholder="e.g. @miasterling"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none transition-all text-base sm:text-xs text-studio-ink"
              />
            </div>
          </div>

          {/* Nail Preferences */}
          <div className="pt-2 border-t border-studio-border">
            <h4 className="font-semibold text-studio-ink text-xs mb-3 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-studio-wine" />
              <span>Nail Architecture & Style Preferences</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-studio-muted mb-1">
                  Preferred Silhouette
                </label>
                <select
                  value={formData.preferredShape}
                  onChange={(e) => setFormData({ ...formData, preferredShape: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink"
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
                <label className="block font-medium text-studio-muted mb-1">
                  Preferred Length
                </label>
                <select
                  value={formData.preferredLength}
                  onChange={(e) => setFormData({ ...formData, preferredLength: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink"
                >
                  <option value="Short">Short (Active)</option>
                  <option value="Medium">Medium (Balanced)</option>
                  <option value="Long">Long (Dramatic)</option>
                  <option value="Extra Long">Extra Long (Statement)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-studio-muted mb-1">
                  Signature Aesthetic
                </label>
                <select
                  value={formData.preferredAesthetic}
                  onChange={(e) => setFormData({ ...formData, preferredAesthetic: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink"
                >
                  <option value="3D Chrome & Glaze">3D Chrome & Glaze</option>
                  <option value="BIAB Clean Natural">BIAB Clean Natural</option>
                  <option value="French Ombre Minimalist">French Ombre Minimalist</option>
                  <option value="Velvet Cat Eye">Velvet Cat Eye</option>
                  <option value="Sculptural Charms">Sculptural Charms</option>
                  <option value="Hand-Painted Abstract">Hand-Painted Abstract</option>
                  <option value="High Fashion Editorial">High Fashion Editorial</option>
                </select>
              </div>
            </div>
          </div>

          {/* Health & Allergies */}
          <div className="pt-2">
            <label className="block font-semibold text-studio-secondary mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Allergies or Nail Sensitivities</span>
            </label>
            <input
              type="text"
              placeholder="e.g. HEMA-free gel only, delicate cuticles, acetone sensitivity"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink"
            />
          </div>

          {/* Notes & VIP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block font-semibold text-studio-secondary mb-1">
                Client Birthday (optional)
              </label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink"
              />
            </div>

            <div className="flex items-center pt-2 sm:pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.vip}
                  onChange={(e) => setFormData({ ...formData, vip: e.target.checked })}
                  className="w-4 h-4 rounded text-studio-wine focus:ring-studio-wine border-studio-border accent-studio-wine"
                />
                <span className="font-semibold text-studio-ink">Designate as VIP Client</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-studio-secondary mb-1.5">
              Studio Notes & Favorites
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Books 3 weeks in advance, loves sheer strawberry jelly tones"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-studio-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-studio-border text-studio-secondary hover:bg-studio-subtle text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white text-xs font-semibold shadow-studio transition-all active:scale-95"
            >
              {clientToEdit ? 'Save Changes' : 'Register Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

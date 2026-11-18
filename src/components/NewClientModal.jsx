import React, { useState, useEffect } from 'react';
import ModalPortal from './ModalPortal';
import { X, User, Phone, FileText, CalendarHeart, ArrowRight } from 'lucide-react';
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
      alert('Please provide at least client full name and contact phone number.');
      return;
    }
    onSave(formData);
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      {/* Dedicated full-bleed non-scrolling backdrop */}
      <div
        className="fixed inset-0 z-[70] bg-studio-ink/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Scrollable floating dialog container */}
      <div className="fixed inset-0 z-[71] flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto pointer-events-none animate-fade-in">
        <div className="bg-studio-surface rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-studio-float border-t sm:border border-studio-border relative max-h-[92vh] overflow-y-auto font-sans my-auto pointer-events-auto">
        <div className="w-10 h-1.5 rounded-full bg-studio-borderStrong mx-auto mb-3 sm:hidden" />
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full text-studio-muted hover:text-studio-ink hover:bg-studio-subtle transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-wineLight text-studio-wine text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5" />
            <span>{clientToEdit ? 'Update Profile' : 'New Client Profile'}</span>
          </div>
          <h3 className="font-display italic font-bold text-2xl text-studio-ink">
            {clientToEdit ? 'Edit Client Details' : 'Register New Client'}
          </h3>
          <p className="text-xs text-studio-secondary mt-1">
            {clientToEdit
              ? 'Update essential contact information and client notes.'
              : 'Enter essential client details. Next, book an appointment or skip.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Name & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-studio-secondary mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-studio-wine" />
                <span>Client Full Name *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mia Sterling"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none transition-all text-base sm:text-xs text-studio-ink placeholder:text-studio-muted/70"
              />
            </div>

            <div>
              <label className="block font-semibold text-studio-secondary mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-studio-wine" />
                <span>Contact / Phone *</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none transition-all text-base sm:text-xs text-studio-ink placeholder:text-studio-muted/70"
              />
            </div>
          </div>

          {/* Instagram Handle */}
          <div>
            <label className="block font-semibold text-studio-secondary mb-1.5 flex items-center gap-1.5">
              <InstagramIcon className="w-3.5 h-3.5 text-studio-wine" />
              <span>Instagram Handle</span>
              <span className="text-[10px] text-studio-muted font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. @miasterling"
              value={formData.instagram}
              onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none transition-all text-base sm:text-xs text-studio-ink placeholder:text-studio-muted/70"
            />
          </div>

          {/* Studio Notes & Preferences */}
          <div>
            <label className="block font-semibold text-studio-secondary mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-studio-wine" />
              <span>Notes</span>
              <span className="text-[10px] text-studio-muted font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Medium Almond, prefers sheer jelly tones, delicate cuticles, bridal trial..."
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none transition-all text-base sm:text-xs text-studio-ink resize-none placeholder:text-studio-muted/70"
            />
          </div>

          {/* Guidance badge for new client registration */}
          {!clientToEdit && (
            <div className="p-3 rounded-2xl bg-studio-wineLight/70 border border-studio-wine/15 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-studio-wine font-medium">
                <CalendarHeart className="w-4 h-4 shrink-0" />
                <span>An appointment booking popup will open next with an option to skip.</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-studio-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-studio-border text-studio-secondary hover:bg-studio-subtle text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white text-xs font-semibold shadow-studio transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>{clientToEdit ? 'Save Changes' : 'Save & Continue'}</span>
              {!clientToEdit && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  </ModalPortal>
  );
}

import React from 'react';
import {
  X,
  Calendar,
  Users,
  Receipt,
  AlertTriangle,
  Gift,
  Smartphone,
  ChevronRight,
  Share2,
  Heart
} from 'lucide-react';

export default function MobileQuickActionSheet({
  isOpen,
  onClose,
  onOpenNewAppointment,
  onOpenNewClient,
  onOpenNewInvoice,
  onOpenRepairQueue,
  onOpenGiftCard,
  onOpenQrModal,
  onOpenShareCatalogue
}) {
  if (!isOpen) return null;

  const actions = [
    {
      id: 'share_catalogue',
      title: 'Share Catalogue (No Prices)',
      desc: 'Send WhatsApp or copy client link without prices',
      icon: Share2,
      bg: 'bg-rose-50 text-rose-600',
      border: 'border-rose-200/80',
      badge: 'Client',
      action: () => {
        onClose();
        if (onOpenShareCatalogue) onOpenShareCatalogue();
      }
    },
    {
      id: 'appointment',
      title: 'Book Appointment',
      desc: 'Schedule slot, set duration & notify phone',
      icon: Calendar,
      bg: 'bg-pink-50 text-pink-600',
      border: 'border-pink-100',
      action: () => {
        onClose();
        onOpenNewAppointment();
      }
    },
    {
      id: 'client',
      title: 'Register New Client',
      desc: 'Save profile, nail shape, length & allergies',
      icon: Users,
      bg: 'bg-pink-50 text-pink-600',
      border: 'border-pink-100',
      action: () => {
        onClose();
        onOpenNewClient();
      }
    },
    {
      id: 'invoice',
      title: 'Create Invoice / Receipt',
      desc: 'Itemize services, tips & generate shareable link',
      icon: Receipt,
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
      action: () => {
        onClose();
        onOpenNewInvoice();
      }
    },
    {
      id: 'repair',
      title: 'Emergency Nail Repair',
      desc: 'Log broken tip / chipped overlay squeeze-in',
      icon: AlertTriangle,
      bg: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
      action: () => {
        onClose();
        onOpenRepairQueue();
      }
    },
    {
      id: 'gift',
      title: 'Issue Gift Certificate',
      desc: 'Generate branded luxury gift voucher',
      icon: Gift,
      bg: 'bg-purple-50 text-purple-600',
      border: 'border-purple-100',
      action: () => {
        onClose();
        onOpenGiftCard();
      }
    },
    {
      id: 'phone',
      title: 'Connect Phone / QR Alert',
      desc: 'Check live ntfy push notification connection',
      icon: Smartphone,
      bg: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
      action: () => {
        onClose();
        onOpenQrModal();
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-t-3xl max-w-lg w-full p-5 pb-8 shadow-2xl border-t border-rose-100 max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-250">
        {/* Drag Handle */}
        <div className="w-12 h-1.5 rounded-full bg-stone-200 mx-auto" />

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-brand-wine fill-brand-wine shrink-0" />
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Quick Studio Action
              </h3>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Instant studio shortcuts for Nails by Sirii
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons List */}
        <div className="space-y-2 pt-1">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={act.action}
                className={`w-full p-3.5 rounded-2xl border ${act.border} bg-white hover:bg-stone-50 text-left flex items-center justify-between gap-3 transition-all active:scale-[0.98] shadow-xs group`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl ${act.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900 text-sm">
                      {act.title}
                    </div>
                    <div className="text-[11px] text-stone-400 line-clamp-1">
                      {act.desc}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-600 transition-colors" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


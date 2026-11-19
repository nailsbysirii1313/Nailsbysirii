import React, { useState } from 'react';
import ModalPortal from './ModalPortal';
import {
  X,
  Phone,
  Mail,
  Palette,
  Calendar,
  CreditCard,
  AlertCircle,
  Plus,
  Receipt,
  Edit3,
  Trash2,
  Heart,
  MessageSquare,
  Award,
  Check,
  Camera,
  Image as ImageIcon,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Droplets
} from 'lucide-react';
import { InstagramIcon } from './Icons';
import { getKolkataTodayString } from '../utils/dateTime';

export default function ClientDetailDrawer({
  client,
  appointments,
  invoices,
  isOpen,
  onClose,
  onEditClient,
  onDeleteClient,
  onUpdateClient,
  onBookAppointment,
  onOpenInvoice,
  onCreateInvoice,
  onOpenMessageModal,
  onOpenAftercareModal
}) {
  if (!isOpen || !client) return null;

  const clientAppointments = appointments.filter((a) => a.clientId === client.id);
  const clientInvoices = invoices.filter((i) => i.clientId === client.id);

  const totalSpent = clientInvoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + (Number(inv.total) || 0), client.totalSpent || 0);

  const [drawerTab, setDrawerTab] = useState('profile');
  const [moodboardItems, setMoodboardItems] = useState(
    Array.isArray(client.moodboardItems)
      ? client.moodboardItems
      : Array.isArray(client.nailHistory)
      ? client.nailHistory
      : []
  );
  const [newSetTitle, setNewSetTitle] = useState('');
  const [newSetNotes, setNewSetNotes] = useState('');

  const handleAddSet = async (e) => {
    e.preventDefault();
    if (!newSetTitle.trim()) return;
    const newItem = {
      id: Date.now(),
      title: newSetTitle.trim(),
      date: getKolkataTodayString(),
      shape: client.preferredShape || 'Almond',
      notes: newSetNotes.trim() || 'Custom studio set'
    };
    const updated = [newItem, ...moodboardItems];
    setMoodboardItems(updated);
    setNewSetTitle('');
    setNewSetNotes('');
    if (onUpdateClient) {
      try {
        await onUpdateClient(client.id, { ...client, moodboardItems: updated });
      } catch (err) {
        console.error('Failed to save client lookbook item', err);
      }
    }
  };

  const handleDeleteSet = async (itemId) => {
    const updated = moodboardItems.filter((m) => m.id !== itemId);
    setMoodboardItems(updated);
    if (onUpdateClient) {
      try {
        await onUpdateClient(client.id, { ...client, moodboardItems: updated });
      } catch (err) {
        console.error('Failed to update client lookbook', err);
      }
    }
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      {/* Dedicated full-bleed non-scrolling backdrop */}
      <div
        className="fixed inset-0 z-[70] bg-studio-ink/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer slide-in panel */}
      <div
        className="fixed inset-0 z-[71] flex justify-end animate-fade-in font-sans"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="bg-studio-surface w-full max-w-md h-full shadow-studio-float border-l border-studio-border flex flex-col justify-between overflow-y-auto overscroll-contain"
        >
          {/* Header */}
          <div>
            <div className="p-6 border-b border-studio-border bg-studio-subtle/50 relative">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full text-studio-muted hover:text-studio-ink hover:bg-studio-surface transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-studio-wine via-studio-wineHover to-studio-rose text-white flex items-center justify-center font-display italic font-bold text-xl shadow-studio">
                  {client.name.charAt(0)}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display italic font-bold text-xl text-studio-ink">
                      {client.name}
                    </h3>
                    {client.vip && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-studio-muted">Client ID: {client.id}</p>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 bg-studio-surface rounded-2xl border border-studio-border shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-studio-muted block">
                    Total Visits
                  </span>
                  <span className="font-display font-bold text-lg text-studio-ink">
                    {client.totalVisits || clientAppointments.length}
                  </span>
                </div>
                <div className="p-3 bg-studio-surface rounded-2xl border border-studio-border shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-studio-muted block">
                    Lifetime Spend
                  </span>
                  <span className="font-display font-bold text-lg text-studio-wine">
                    ₹{Number(totalSpent).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => onOpenMessageModal && onOpenMessageModal(client)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-studio active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message Client (WhatsApp / SMS)</span>
                </button>
              </div>

              {/* Sub-tab Navigation */}
              <div className="mt-3.5 flex items-center gap-1 p-1 bg-studio-canvas/70 rounded-xl border border-studio-border">
                <button
                  type="button"
                  onClick={() => setDrawerTab('profile')}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${drawerTab === 'profile'
                      ? 'bg-studio-wine text-white shadow-xs'
                      : 'text-studio-secondary hover:bg-studio-surface'
                    }`}
                >
                  Profile & History
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerTab('moodboard')}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${drawerTab === 'moodboard'
                      ? 'bg-studio-wine text-white shadow-xs'
                      : 'text-studio-secondary hover:bg-studio-surface'
                    }`}
                >
                  Set Looks
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerTab('consultation')}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${drawerTab === 'consultation'
                      ? 'bg-studio-wine text-white shadow-xs'
                      : 'text-studio-secondary hover:bg-studio-surface'
                    }`}
                >
                  Health & Care
                </button>
              </div>
            </div>

            {/* Details Content */}
            <div className="p-6 space-y-6 text-xs font-sans">
              {drawerTab === 'profile' ? (
                <>
                  {/* Loyalty Punch Card */}
                  <div className="p-4 rounded-2xl bg-studio-wineLight/60 border border-studio-border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-studio-wine" />
                        <span className="font-bold text-studio-ink text-xs">
                          Studio VIP Loyalty Rewards
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-studio-wine bg-studio-surface px-2 py-0.5 rounded-full border border-studio-border">
                        {(client.totalVisits || 0)} Visits Logged
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                        const isFilled = (client.totalVisits || 0) >= num;
                        const isMilestone = num === 5 || num === 10;

                        return (
                          <div
                            key={num}
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${isFilled
                                ? 'bg-studio-wine text-white border-studio-wine shadow-xs'
                                : isMilestone
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : 'bg-studio-surface text-studio-muted border-studio-border'
                              }`}
                            title={
                              num === 5
                                ? 'Visit 5 Reward: Complimentary Art Accent'
                                : num === 10
                                  ? 'Visit 10 Reward: 50% Off Full Set'
                                  : `Visit ${num}`
                            }
                          >
                            {isFilled ? <Check className="w-3.5 h-3.5" /> : num}
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-[10px] text-studio-secondary leading-tight pt-0.5 flex justify-between">
                      <span>Visit 5: Art Tier Bonus</span>
                      <span>Visit 10: 50% Off Full Set</span>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-studio-muted block">
                      Contact Information
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-studio-secondary">
                        <Phone className="w-4 h-4 text-studio-wine shrink-0" />
                        <a href={`tel:${client.phone}`} className="hover:text-studio-wine font-medium">
                          {client.phone}
                        </a>
                      </div>
                      {client.email && (
                        <div className="flex items-center gap-2 text-studio-secondary">
                          <Mail className="w-4 h-4 text-studio-wine shrink-0" />
                          <a href={`mailto:${client.email}`} className="hover:text-studio-wine font-medium">
                            {client.email}
                          </a>
                        </div>
                      )}
                      {client.instagram && (
                        <div className="flex items-center gap-2 text-studio-secondary">
                          <InstagramIcon className="w-4 h-4 text-studio-wine shrink-0" />
                          <span className="font-medium text-studio-wine">
                            {client.instagram}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nail Anatomy & Styling */}
                  <div className="p-4 rounded-2xl bg-studio-canvas border border-studio-border space-y-3">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-studio-wine" />
                      <span className="font-bold text-studio-ink">Nail Style Profile</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-studio-muted block text-[10px]">Silhouette</span>
                        <span className="font-semibold text-studio-secondary">
                          {client.preferredShape || 'Almond'}
                        </span>
                      </div>
                      <div>
                        <span className="text-studio-muted block text-[10px]">Length</span>
                        <span className="font-semibold text-studio-secondary">
                          {client.preferredLength || 'Medium'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-studio-muted block text-[10px]">Signature Aesthetic</span>
                      <span className="inline-block mt-1 px-2.5 py-1 rounded-lg bg-studio-surface border border-studio-border font-semibold text-studio-wine text-[11px]">
                        {client.preferredAesthetic || '3D Chrome & Glaze'}
                      </span>
                    </div>
                  </div>

                  {/* Allergies / Health */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Allergies & Sensitivities</span>
                    </div>
                    <p className="leading-relaxed font-medium">
                      {client.allergies || 'No allergies reported'}
                    </p>
                  </div>

                  {/* Notes */}
                  {client.notes && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-studio-muted block">
                        Studio Notes
                      </span>
                      <p className="p-3 bg-studio-canvas rounded-xl border border-studio-border text-studio-secondary italic leading-relaxed">
                        "{client.notes}"
                      </p>
                    </div>
                  )}

                  {/* Appointment History */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-studio-muted">
                        Appointment History ({clientAppointments.length})
                      </span>
                      <button
                        onClick={() => onBookAppointment(client)}
                        className="text-xs font-semibold text-studio-wine hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Book Next</span>
                      </button>
                    </div>

                    {clientAppointments.length === 0 ? (
                      <p className="text-studio-muted italic">No past appointments recorded.</p>
                    ) : (
                      <div className="space-y-2">
                        {clientAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            className="p-3 rounded-xl border border-studio-border bg-studio-surface flex items-center justify-between"
                          >
                            <div>
                              <p className="font-semibold text-studio-ink">{apt.serviceName}</p>
                              <p className="text-[11px] text-studio-muted">
                                {apt.date} at {apt.time} • ₹{Number(apt.price).toLocaleString('en-IN')}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${apt.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-studio-wineLight text-studio-wine border border-studio-border'
                                }`}
                            >
                              {apt.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Invoices List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-studio-muted">
                        Billing & Invoices ({clientInvoices.length})
                      </span>
                      <button
                        onClick={() => onCreateInvoice(client)}
                        className="text-xs font-semibold text-studio-wine hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Invoice</span>
                      </button>
                    </div>

                    {clientInvoices.length === 0 ? (
                      <p className="text-studio-muted italic">No invoices issued yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {clientInvoices.map((inv) => (
                          <div
                            key={inv.id}
                            onClick={() => onOpenInvoice(inv)}
                            className="p-3 rounded-xl border border-studio-border bg-studio-surface hover:border-studio-borderStrong cursor-pointer flex items-center justify-between transition-colors"
                          >
                            <div>
                              <p className="font-semibold text-studio-ink font-mono text-[11px]">
                                {inv.invoiceNumber}
                              </p>
                              <p className="text-[11px] text-studio-muted">
                                {inv.date} • ₹{Number(inv.total).toLocaleString('en-IN')}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${inv.status === 'Paid'
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : 'bg-amber-50 text-amber-800'
                                }`}
                            >
                              {inv.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : drawerTab === 'moodboard' ? (
                /* Set Looks & Moodboard */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-studio-muted">
                      Documented Looks & Inspiration ({moodboardItems.length})
                    </span>
                  </div>

                  {/* Add new look */}
                  <form
                    onSubmit={handleAddSet}
                    className="p-3.5 bg-studio-canvas rounded-2xl border border-studio-border space-y-2"
                  >
                    <span className="font-semibold text-studio-ink text-xs block">
                      Document Finished Set / Photo Log
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Style name (e.g. Sculpted chrome ribbons on milky silk)"
                      value={newSetTitle}
                      onChange={(e) => setNewSetTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-studio-border bg-studio-surface outline-none text-base sm:text-xs text-studio-ink"
                    />
                    <input
                      type="text"
                      placeholder="Retention notes (e.g. 4-week BIAB retention, zero lifting)"
                      value={newSetNotes}
                      onChange={(e) => setNewSetNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-studio-border bg-studio-surface outline-none text-base sm:text-xs text-studio-ink"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white font-semibold text-xs shadow-studio flex items-center justify-center gap-1 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save to Client Lookbook</span>
                    </button>
                  </form>

                  {/* Looks List */}
                  <div className="space-y-2.5">
                    {moodboardItems.length === 0 ? (
                      <div className="p-6 text-center rounded-2xl border border-dashed border-studio-border bg-studio-canvas/50">
                        <Palette className="w-6 h-6 text-studio-muted mx-auto mb-2 opacity-60" />
                        <p className="text-xs font-semibold text-studio-ink">No documented looks yet</p>
                        <p className="text-[11px] text-studio-muted mt-0.5">
                          Use the form above to log this client's signature sets, inspo photos, or retention notes.
                        </p>
                      </div>
                    ) : (
                      moodboardItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-2xl border border-studio-border bg-studio-surface space-y-1.5 shadow-xs relative group"
                        >
                          <div className="flex items-center justify-between pr-6">
                            <span className="font-display italic font-bold text-sm text-studio-ink">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-studio-muted">{item.date}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteSet(item.id)}
                            className="absolute top-3 right-3 p-1.5 rounded-lg text-studio-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete look"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="inline-block px-2 py-0.5 rounded-md bg-studio-wineLight text-studio-wine text-[10px] font-semibold border border-studio-border">
                            {item.shape}
                          </span>
                          <p className="text-[11px] text-studio-secondary leading-relaxed">
                            {item.notes}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                /* Consultation, Nail Health & Care Tab */
                <div className="space-y-5 animate-fade-in">
                  {/* Aftercare Card Launcher */}
                  <div className="p-4 rounded-2xl bg-studio-wineLight/60 border border-studio-border shadow-xs space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-studio-wine" />
                      <span className="text-xs font-bold text-studio-ink uppercase tracking-wider">
                        Client Aftercare Stationery
                      </span>
                    </div>
                    <p className="text-[11px] text-studio-secondary leading-relaxed">
                      Generate an editorial aftercare card tailored specifically to {client.name}'s nail service and natural plate condition.
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpenAftercareModal && onOpenAftercareModal(client, clientAppointments[0] || null)}
                      className="w-full py-2.5 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white font-semibold text-xs shadow-studio transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View & Send Aftercare Card</span>
                    </button>
                  </div>

                  {/* Nail Health Diagnostic Card */}
                  <div className="p-4 rounded-2xl bg-studio-surface border border-studio-border shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display italic font-bold text-sm text-studio-ink">
                        Nail Plate & Anatomy Evaluation
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        Active File
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-studio-canvas border border-studio-border flex items-center justify-between">
                        <span className="text-studio-muted">Natural Plate Condition:</span>
                        <span className="font-semibold text-studio-ink">
                          {client.allergies?.toLowerCase().includes('delicate')
                            ? 'Grade B (Delicate / Flexible)'
                            : 'Grade A (Dense & Resilient)'}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-studio-canvas border border-studio-border flex items-center justify-between">
                        <span className="text-studio-muted">Eponychium / Cuticle:</span>
                        <span className="font-semibold text-studio-ink">
                          {client.allergies?.toLowerCase().includes('cuticle')
                            ? 'Ultra-Delicate (Dry Russian Only)'
                            : 'Normal Elasticity'}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-studio-canvas border border-studio-border flex items-center justify-between">
                        <span className="text-studio-muted">Skin Undertone:</span>
                        <span className="font-semibold text-studio-ink">
                          Neutral Rose Gold
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Flattering Nude Shade Palettes */}
                  <div className="p-4 rounded-2xl bg-studio-surface border border-studio-border shadow-xs space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-studio-wine" />
                      <span className="font-display italic font-bold text-sm text-studio-ink">
                        Flattering Mineral Base Matches
                      </span>
                    </div>
                    <p className="text-[11px] text-studio-secondary">
                      Curated builder shades specifically matched to {client.name}'s skin tone:
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Cashmere Nude', 'Strawberry Jelly', 'Milky Silk', 'Bare Petal'].map((shade) => (
                        <span
                          key={shade}
                          className="px-2.5 py-1 rounded-lg bg-studio-wineLight text-studio-wine border border-studio-border font-semibold text-[10px]"
                        >
                          {shade}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Patch Test Record */}
                  <div className="p-4 rounded-2xl bg-studio-surface border border-studio-border shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span className="font-display italic font-bold text-sm text-studio-ink">
                          Patch Test Record
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Passed
                      </span>
                    </div>
                    <div className="text-[11px] text-studio-secondary space-y-1 bg-studio-canvas p-2.5 rounded-xl border border-studio-border">
                      <div className="flex justify-between">
                        <span className="text-studio-muted">Tested Formula:</span>
                        <span className="font-semibold text-studio-ink">HEMA-Free Builder & Gel-X Adhesive</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-studio-muted">Inspection Date:</span>
                        <span className="font-semibold text-studio-ink">Nov 1, 2026</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-studio-muted">Clinical Reaction:</span>
                        <span className="text-emerald-800 font-semibold">Zero Erythema or Itching</span>
                      </div>
                    </div>
                  </div>

                  {/* Long-Term Care Plan */}
                  <div className="p-4 rounded-2xl bg-studio-canvas border border-studio-border space-y-2">
                    <span className="font-bold text-studio-ink text-xs block">
                      Custom Long-Term Care Strategy
                    </span>
                    <p className="text-[11px] text-studio-secondary leading-relaxed">
                      Prioritize strengthening BIAB infills every 3 weeks rather than frequent removals. Ensure daily cuticle oil application to seal lateral sidewalls and preserve retention.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-studio-border bg-studio-canvas/50 flex items-center justify-between gap-2">
            <button
              onClick={() => onEditClient(client)}
              className="flex-1 py-2.5 px-3 rounded-xl border border-studio-border bg-studio-surface hover:bg-studio-wineLight text-studio-ink text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-studio-wine" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={() => onDeleteClient(client.id)}
              className="py-2.5 px-3 rounded-xl border border-rose-200 bg-studio-surface hover:bg-rose-50 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

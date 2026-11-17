import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  Sparkles,
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

export default function ClientDetailDrawer({
  client,
  appointments,
  invoices,
  isOpen,
  onClose,
  onEditClient,
  onDeleteClient,
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
  const [moodboardItems, setMoodboardItems] = useState([
    {
      id: 1,
      title: 'Bridal Trial • Micro French Ombre',
      date: '2026-11-10',
      shape: client.preferredShape || 'Medium Almond',
      notes: 'Sheer strawberry milk base with ultra-fine white tips.'
    },
    {
      id: 2,
      title: 'Hailey Glazed Donut Chrome',
      date: '2026-10-18',
      shape: client.preferredShape || 'Medium Almond',
      notes: 'White pearl chrome powder over natural BIAB overlay.'
    }
  ]);
  const [newSetTitle, setNewSetTitle] = useState('');
  const [newSetNotes, setNewSetNotes] = useState('');

  const handleAddSet = (e) => {
    e.preventDefault();
    if (!newSetTitle.trim()) return;
    setMoodboardItems([
      {
        id: Date.now(),
        title: newSetTitle.trim(),
        date: new Date().toISOString().split('T')[0],
        shape: client.preferredShape || 'Almond',
        notes: newSetNotes.trim() || 'Custom salon set'
      },
      ...moodboardItems
    ]);
    setNewSetTitle('');
    setNewSetNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-atelier-noir/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-float border-l border-atelier-champagneBorder flex flex-col justify-between overflow-y-auto">
        {/* Header */}
        <div>
          <div className="p-6 border-b border-atelier-champagneBorder/60 bg-atelier-blush/40 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-atelier-muted hover:text-atelier-noir hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-atelier-rose500 via-atelier-rose400 to-atelier-rose200 text-white flex items-center justify-center font-serif italic font-bold text-xl shadow-soft">
                {client.name.charAt(0)}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif italic font-bold text-xl text-atelier-noir">
                    {client.name}
                  </h3>
                  {client.vip && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      VIP
                    </span>
                  )}
                </div>
                <p className="text-xs text-atelier-muted">Client ID: {client.id}</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-white/90 rounded-2xl border border-atelier-champagneBorder">
                <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted block">
                  Total Visits
                </span>
                <span className="font-serif font-bold text-lg text-atelier-noir">
                  {client.totalVisits || clientAppointments.length}
                </span>
              </div>
              <div className="p-3 bg-white/90 rounded-2xl border border-atelier-champagneBorder">
                <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted block">
                  Lifetime Spend
                </span>
                <span className="font-serif font-bold text-lg text-atelier-rose600">
                  ₹{Number(totalSpent).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => onOpenMessageModal && onOpenMessageModal(client)}
                className="flex-1 py-2 px-3 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Client (WhatsApp / SMS)</span>
              </button>
            </div>

            {/* Sub-tab Navigation */}
            <div className="mt-3.5 flex items-center gap-1 p-1 bg-white/70 rounded-xl border border-atelier-champagneBorder">
              <button
                type="button"
                onClick={() => setDrawerTab('profile')}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  drawerTab === 'profile'
                    ? 'bg-atelier-rose500 text-white shadow-sm'
                    : 'text-atelier-charcoal hover:bg-white'
                }`}
              >
                Profile & History
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab('moodboard')}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  drawerTab === 'moodboard'
                    ? 'bg-atelier-rose500 text-white shadow-sm'
                    : 'text-atelier-charcoal hover:bg-white'
                }`}
              >
                Set Looks
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab('consultation')}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  drawerTab === 'consultation'
                    ? 'bg-atelier-rose500 text-white shadow-sm'
                    : 'text-atelier-charcoal hover:bg-white'
                }`}
              >
                Health & Care
              </button>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 space-y-6 text-xs">
            {drawerTab === 'profile' ? (
              <>
            {/* Loyalty Punch Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-atelier-rose50 to-white border border-atelier-rose200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-atelier-rose500" />
                  <span className="font-bold text-atelier-noir text-xs">
                    Studio VIP Loyalty Rewards
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-atelier-rose600 bg-atelier-rose100 px-2 py-0.5 rounded-full">
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
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                        isFilled
                          ? 'bg-atelier-rose500 text-white border-atelier-rose600 shadow-sm'
                          : isMilestone
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-white text-atelier-muted border-atelier-champagneBorder'
                      }`}
                      title={
                        num === 5
                          ? 'Visit 5 Reward: Free Tier 2 Nail Art'
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

              <div className="text-[10px] text-atelier-muted leading-tight pt-0.5 flex justify-between">
                <span>Visit 5: Free Nail Art</span>
                <span>Visit 10: 50% Off Full Set</span>
              </div>
            </div>
            {/* Contact Information */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted block">
                Contact Information
              </span>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-atelier-charcoal">
                  <Phone className="w-4 h-4 text-atelier-rose500 shrink-0" />
                  <a href={`tel:${client.phone}`} className="hover:text-atelier-rose600 font-medium">
                    {client.phone}
                  </a>
                </div>
                {client.email && (
                  <div className="flex items-center gap-2 text-atelier-charcoal">
                    <Mail className="w-4 h-4 text-atelier-rose500 shrink-0" />
                    <a href={`mailto:${client.email}`} className="hover:text-atelier-rose600 font-medium">
                      {client.email}
                    </a>
                  </div>
                )}
                {client.instagram && (
                  <div className="flex items-center gap-2 text-atelier-charcoal">
                    <InstagramIcon className="w-4 h-4 text-atelier-rose500 shrink-0" />
                    <span className="font-medium text-atelier-rose600">
                      {client.instagram}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Nail Anatomy & Styling */}
            <div className="p-4 rounded-2xl bg-atelier-cream border border-atelier-champagneBorder space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-atelier-rose500" />
                <span className="font-bold text-atelier-noir">Nail Style Profile</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-atelier-muted block text-[10px]">Shape</span>
                  <span className="font-semibold text-atelier-charcoal">
                    {client.preferredShape || 'Almond'}
                  </span>
                </div>
                <div>
                  <span className="text-atelier-muted block text-[10px]">Length</span>
                  <span className="font-semibold text-atelier-charcoal">
                    {client.preferredLength || 'Medium'}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-atelier-muted block text-[10px]">Signature Aesthetic</span>
                <span className="inline-block mt-1 px-2.5 py-1 rounded-lg bg-white border border-atelier-champagneBorder font-semibold text-atelier-rose600 text-[11px]">
                  {client.preferredAesthetic || '3D Chrome & Glaze'}
                </span>
              </div>
            </div>

            {/* Allergies / Health */}
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Allergies & Sensitivities</span>
              </div>
              <p className="text-amber-900 leading-relaxed font-medium">
                {client.allergies || 'No allergies reported'}
              </p>
            </div>

            {/* Notes */}
            {client.notes && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted block">
                  Studio Notes
                </span>
                <p className="p-3 bg-atelier-cream/60 rounded-xl border border-atelier-champagneBorder/60 text-atelier-charcoal italic leading-relaxed">
                  "{client.notes}"
                </p>
              </div>
            )}

            {/* Appointment History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted">
                  Appointment History ({clientAppointments.length})
                </span>
                <button
                  onClick={() => onBookAppointment(client)}
                  className="text-xs font-semibold text-atelier-rose600 hover:text-atelier-rose500 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Book Next</span>
                </button>
              </div>

              {clientAppointments.length === 0 ? (
                <p className="text-atelier-muted italic">No past appointments recorded.</p>
              ) : (
                <div className="space-y-2">
                  {clientAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3 rounded-xl border border-atelier-champagneBorder bg-white flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-atelier-noir">{apt.serviceName}</p>
                        <p className="text-[11px] text-atelier-muted">
                          {apt.date} at {apt.time} • ₹{Number(apt.price).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          apt.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-atelier-rose50 text-atelier-rose600'
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted">
                  Billing & Invoices ({clientInvoices.length})
                </span>
                <button
                  onClick={() => onCreateInvoice(client)}
                  className="text-xs font-semibold text-atelier-rose600 hover:text-atelier-rose500 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Invoice</span>
                </button>
              </div>

              {clientInvoices.length === 0 ? (
                <p className="text-atelier-muted italic">No invoices issued yet.</p>
              ) : (
                <div className="space-y-2">
                  {clientInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => onOpenInvoice(inv)}
                      className="p-3 rounded-xl border border-atelier-champagneBorder bg-white hover:border-atelier-rose300 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-atelier-noir font-mono text-[11px]">
                          {inv.invoiceNumber}
                        </p>
                        <p className="text-[11px] text-atelier-muted">
                          {inv.date} • ₹{Number(inv.total).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
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
                  <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted">
                    Documented Looks & Inspiration ({moodboardItems.length})
                  </span>
                </div>

                {/* Add new look */}
                <form
                  onSubmit={handleAddSet}
                  className="p-3.5 bg-atelier-cream/60 rounded-2xl border border-atelier-champagneBorder space-y-2"
                >
                  <span className="font-semibold text-atelier-noir text-xs block">
                    Document Finished Set / Ring Light Photo Log
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Style name (e.g. Chrome stars on milky pink)"
                    value={newSetTitle}
                    onChange={(e) => setNewSetTitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-atelier-champagneBorder bg-white outline-none text-base sm:text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Retention notes (e.g. 4-week BIAB growth, no lifting)"
                    value={newSetNotes}
                    onChange={(e) => setNewSetNotes(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-atelier-champagneBorder bg-white outline-none text-base sm:text-xs"
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 rounded-lg bg-atelier-rose500 hover:bg-atelier-rose600 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save to Client Lookbook</span>
                  </button>
                </form>

                {/* Looks List */}
                <div className="space-y-2.5">
                  {moodboardItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl border border-atelier-champagneBorder bg-white space-y-1.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif italic font-bold text-sm text-atelier-noir">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-atelier-muted">{item.date}</span>
                      </div>
                      <span className="inline-block px-2 py-0.5 rounded-md bg-atelier-rose50 text-atelier-rose600 text-[10px] font-semibold border border-atelier-rose200/60">
                        {item.shape}
                      </span>
                      <p className="text-[11px] text-atelier-charcoal leading-relaxed">
                        {item.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Consultation, Nail Health & Care Tab */
              <div className="space-y-5 animate-fade-in">
                {/* Aftercare Card Launcher */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-atelier-rose100/70 via-white to-atelier-blush border border-atelier-rose200 shadow-sm space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-atelier-rose500" />
                    <span className="text-xs font-bold text-atelier-noir uppercase tracking-wider">
                      Client Aftercare Stationery
                    </span>
                  </div>
                  <p className="text-[11px] text-atelier-muted leading-relaxed">
                    Generate an editorial aftercare guide tailored specifically to {client.name}'s nail service and natural plate condition.
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenAftercareModal && onOpenAftercareModal(client, clientAppointments[0] || null)}
                    className="w-full py-2.5 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white font-semibold text-xs shadow-soft transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View & Print Aftercare Card</span>
                  </button>
                </div>

                {/* Nail Health Diagnostic Card */}
                <div className="p-4 rounded-2xl bg-white border border-atelier-champagneBorder shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif italic font-bold text-sm text-atelier-noir">
                      Nail Plate & Anatomy Evaluation
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      Active File
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-atelier-cream/50 border border-atelier-champagneBorder/60 flex items-center justify-between">
                      <span className="text-atelier-muted">Natural Plate Condition:</span>
                      <span className="font-semibold text-atelier-noir">
                        {client.allergies?.toLowerCase().includes('delicate')
                          ? 'Grade B (Delicate / Flexible)'
                          : 'Grade A (Dense & Resilient)'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-atelier-cream/50 border border-atelier-champagneBorder/60 flex items-center justify-between">
                      <span className="text-atelier-muted">Eponychium / Cuticle:</span>
                      <span className="font-semibold text-atelier-noir">
                        {client.allergies?.toLowerCase().includes('cuticle')
                          ? 'Ultra-Delicate (Dry Russian Only)'
                          : 'Normal Elasticity'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-atelier-cream/50 border border-atelier-champagneBorder/60 flex items-center justify-between">
                      <span className="text-atelier-muted">Skin Undertone:</span>
                      <span className="font-semibold text-atelier-noir">
                        Neutral Rose Gold
                      </span>
                    </div>
                  </div>
                </div>

                {/* Flattering Nude Shade Palettes */}
                <div className="p-4 rounded-2xl bg-white border border-atelier-champagneBorder shadow-sm space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-atelier-rose500" />
                    <span className="font-serif italic font-bold text-sm text-atelier-noir">
                      Flattering Nude Gel Matches
                    </span>
                  </div>
                  <p className="text-[11px] text-atelier-muted">
                    Curated builder shades specifically matched to {client.name}'s skin tone:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Teddy BIAB', 'Cashmere Nude', 'Strawberry Milk Jelly', 'Sheer Rosewater'].map((shade) => (
                      <span
                        key={shade}
                        className="px-2.5 py-1 rounded-lg bg-atelier-rose50 text-atelier-rose600 border border-atelier-rose200/60 font-semibold text-[10px]"
                      >
                        {shade}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Patch Test Record */}
                <div className="p-4 rounded-2xl bg-white border border-atelier-champagneBorder shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-serif italic font-bold text-sm text-atelier-noir">
                        Patch Test Record
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Passed
                    </span>
                  </div>
                  <div className="text-[11px] text-atelier-charcoal space-y-1 bg-atelier-cream/30 p-2.5 rounded-xl border border-atelier-champagneBorder/60">
                    <div className="flex justify-between">
                      <span className="text-atelier-muted">Tested Formula:</span>
                      <span className="font-semibold text-atelier-noir">HEMA-Free Builder & Gel-X Adhesive</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-atelier-muted">Inspection Date:</span>
                      <span className="font-semibold text-atelier-noir">Nov 1, 2026</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-atelier-muted">Clinical Reaction:</span>
                      <span className="text-emerald-700 font-semibold">Zero Erythema or Itching</span>
                    </div>
                  </div>
                </div>

                {/* Long-Term Care Plan */}
                <div className="p-4 rounded-2xl bg-atelier-cream/60 border border-atelier-champagneBorder/80 space-y-2">
                  <span className="font-bold text-atelier-noir text-xs block">
                    Custom Long-Term Care Strategy
                  </span>
                  <p className="text-[11px] text-atelier-charcoal leading-relaxed">
                    Prioritize strengthening BIAB infills every 3 weeks rather than frequent removals. Ensure twice-daily jojoba cuticle oil application to seal lateral sidewalls.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-atelier-champagneBorder bg-atelier-cream/50 flex items-center justify-between gap-2">
          <button
            onClick={() => onEditClient(client)}
            className="flex-1 py-2 px-3 rounded-xl border border-atelier-champagneBorder bg-white hover:bg-atelier-rose50 text-atelier-charcoal text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-atelier-rose500" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => onDeleteClient(client.id)}
            className="py-2 px-3 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

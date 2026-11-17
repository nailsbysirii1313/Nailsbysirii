import React, { useState } from 'react';
import {
  Search,
  Plus,
  Users,
  Sparkles,
  Phone,
  Mail,
  Heart,
  ChevronRight,
  Filter,
  AlertCircle
} from 'lucide-react';
import { InstagramIcon } from './Icons';

export default function ClientsView({
  clients,
  onOpenNewClient,
  onOpenClientProfile,
  onBookAppointment,
  onCreateInvoice
}) {
  const [search, setSearch] = useState('');
  const [filterVip, setFilterVip] = useState(false);
  const [filterShape, setFilterShape] = useState('ALL');

  const filteredClients = clients.filter((c) => {
    const q = (search || '').toLowerCase();
    const matchesSearch =
      (c.name || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.instagram && c.instagram.toLowerCase().includes(q)) ||
      (c.preferredAesthetic && c.preferredAesthetic.toLowerCase().includes(q));

    const matchesVip = filterVip ? c.vip : true;
    const matchesShape =
      filterShape === 'ALL' ? true : (c.preferredShape || '').includes(filterShape);

    return matchesSearch && matchesVip && matchesShape;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-wineLight text-studio-wine text-xs font-semibold mb-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Client Portfolio & CRM</span>
          </div>
          <h2 className="font-display italic font-bold text-2xl sm:text-3xl text-studio-ink">
            Client Directory
          </h2>
          <p className="text-xs text-studio-secondary">
            Manage your client profiles, nail architecture preferences, and lifetime appointment records.
          </p>
        </div>

        <button
          onClick={onOpenNewClient}
          className="px-4 py-2.5 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white text-xs font-semibold shadow-studio transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-studio-surface rounded-2xl p-4 border border-studio-border shadow-studio flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-studio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, phone, instagram, or aesthetic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-studio-canvas/50 border border-studio-border focus:bg-studio-surface focus:border-studio-wine outline-none transition-all text-base sm:text-xs text-studio-ink"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 whitespace-nowrap">
          <button
            onClick={() => setFilterVip(!filterVip)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              filterVip
                ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                : 'bg-studio-surface text-studio-secondary border-studio-border hover:bg-studio-canvas'
            }`}
          >
            <span>VIP Only</span>
          </button>

          <select
            value={filterShape}
            onChange={(e) => setFilterShape(e.target.value)}
            className="px-3 py-2 rounded-xl border border-studio-border bg-studio-surface text-studio-secondary font-semibold text-xs outline-none focus:border-studio-wine shrink-0"
          >
            <option value="ALL">All Silhouettes</option>
            <option value="Almond">Almond</option>
            <option value="Coffin">Coffin</option>
            <option value="Squoval">Squoval</option>
            <option value="Round">Round</option>
            <option value="Square">Square</option>
            <option value="Stiletto">Stiletto</option>
          </select>

          <span className="text-[11px] text-studio-muted pl-1 shrink-0 font-medium">
            {filteredClients.length} clients
          </span>
        </div>
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <div className="bg-studio-surface rounded-3xl p-12 border border-studio-border text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-studio-wineLight text-studio-wine flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <p className="font-display italic font-semibold text-lg text-studio-ink">
            No Clients Found
          </p>
          <p className="text-xs text-studio-secondary max-w-sm mx-auto">
            Try adjusting your search query or register a new client profile.
          </p>
          <button
            onClick={onOpenNewClient}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-studio-wine text-white text-xs font-semibold hover:bg-studio-wineHover shadow-studio"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Client</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-studio-surface rounded-3xl p-5 border border-studio-border hover:border-studio-borderStrong shadow-studio transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top: Avatar, Name & VIP */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-studio-wine via-studio-wineHover to-studio-rose text-white flex items-center justify-center font-display italic font-bold text-base shadow-xs">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3
                          onClick={() => onOpenClientProfile(client)}
                          className="font-display italic font-bold text-base text-studio-ink hover:text-studio-wine cursor-pointer transition-colors"
                        >
                          {client.name}
                        </h3>
                        {client.vip && (
                          <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            VIP
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-studio-muted font-medium">
                        {client.phone}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenClientProfile(client)}
                    className="p-1.5 rounded-xl hover:bg-studio-subtle text-studio-muted hover:text-studio-ink transition-colors"
                    aria-label="View Client Profile"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Social & Contact */}
                <div className="flex items-center gap-3 text-[11px] text-studio-secondary mb-3 font-medium">
                  {client.instagram && (
                    <span className="text-studio-wine font-semibold">
                      {client.instagram}
                    </span>
                  )}
                  {client.email && (
                    <span className="truncate max-w-[150px]">{client.email}</span>
                  )}
                </div>

                {/* Nail Shape / Aesthetics Tags */}
                <div className="space-y-2 py-2.5 border-y border-studio-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-studio-muted text-[10px]">Style Profile:</span>
                    <span className="font-semibold text-studio-ink text-[11px]">
                      {client.preferredShape || 'Almond'} • {client.preferredLength || 'Medium'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-studio-muted text-[10px]">Aesthetic:</span>
                    <span className="px-2 py-0.5 rounded-lg bg-studio-wineLight text-studio-wine font-semibold text-[10px] border border-studio-border">
                      {client.preferredAesthetic || '3D Chrome'}
                    </span>
                  </div>

                  {client.allergies && client.allergies !== 'None reported' && (
                    <div className="flex items-center gap-1.5 p-1.5 bg-amber-50 rounded-lg text-[10px] text-amber-900 font-medium border border-amber-200">
                      <AlertCircle className="w-3 h-3 text-amber-700 shrink-0" />
                      <span className="truncate">{client.allergies}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom: Lifetime stats & Action Buttons */}
              <div className="pt-3 mt-3 flex items-center justify-between gap-2">
                <div className="text-[11px] text-studio-muted">
                  <span className="font-bold text-studio-ink font-display text-sm">
                    {client.totalVisits || 0}
                  </span>{' '}
                  visits •{' '}
                  <span className="font-bold text-studio-ink font-display text-sm">
                    ₹{(client.totalSpent || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onBookAppointment(client)}
                    title="Book Appointment"
                    className="px-3 py-1.5 rounded-xl bg-studio-wineLight hover:bg-studio-subtle text-studio-wine text-[11px] font-semibold border border-studio-border transition-colors active:scale-95"
                  >
                    Book
                  </button>
                  <button
                    onClick={() => onCreateInvoice(client)}
                    title="Generate Invoice"
                    className="px-3 py-1.5 rounded-xl bg-studio-surface hover:bg-studio-canvas text-studio-secondary text-[11px] font-semibold border border-studio-border transition-colors active:scale-95"
                  >
                    Bill
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

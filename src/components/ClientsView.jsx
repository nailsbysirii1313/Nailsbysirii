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
    <div className="space-y-6 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif italic font-bold text-2xl text-atelier-noir">
            Client Directory & CRM
          </h2>
          <p className="text-xs text-atelier-muted">
            Manage your client portfolio, nail preferences, and lifetime appointment records.
          </p>
        </div>

        <button
          onClick={onOpenNewClient}
          className="px-4 py-2.5 rounded-2xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white text-xs font-semibold shadow-soft transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-atelier-champagneBorder shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-atelier-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, phone, instagram, or style..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-atelier-cream/50 border border-atelier-champagneBorder focus:bg-white focus:border-atelier-rose400 outline-none transition-all text-base sm:text-xs"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 whitespace-nowrap">
          <button
            onClick={() => setFilterVip(!filterVip)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              filterVip
                ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-sm'
                : 'bg-white text-atelier-charcoal border-atelier-champagneBorder hover:bg-atelier-cream'
            }`}
          >
            <span>VIP Only</span>
          </button>

          <select
            value={filterShape}
            onChange={(e) => setFilterShape(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-atelier-champagneBorder bg-white text-atelier-charcoal font-semibold text-xs outline-none focus:border-atelier-rose300 shrink-0"
          >
            <option value="ALL">All Shapes</option>
            <option value="Almond">Almond</option>
            <option value="Coffin">Coffin</option>
            <option value="Squoval">Squoval</option>
            <option value="Round">Round</option>
            <option value="Square">Square</option>
            <option value="Stiletto">Stiletto</option>
          </select>

          <span className="text-[11px] text-atelier-muted pl-1 shrink-0">
            {filteredClients.length} clients
          </span>
        </div>
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-atelier-champagneBorder text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-atelier-rose50 text-atelier-rose500 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <p className="font-serif italic font-semibold text-lg text-atelier-noir">
            No Clients Found
          </p>
          <p className="text-xs text-atelier-muted max-w-sm mx-auto">
            Try adjusting your search query or register a new client profile.
          </p>
          <button
            onClick={onOpenNewClient}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-atelier-rose500 text-white text-xs font-semibold hover:bg-atelier-rose600 shadow-soft"
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
              className="bg-white rounded-3xl p-5 border border-atelier-champagneBorder hover:border-atelier-rose300 shadow-sm hover:shadow-soft transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top: Avatar, Name & VIP */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-atelier-rose500 to-atelier-rose200 text-white flex items-center justify-center font-serif italic font-bold text-base shadow-sm">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3
                          onClick={() => onOpenClientProfile(client)}
                          className="font-serif italic font-bold text-base text-atelier-noir hover:text-atelier-rose600 cursor-pointer transition-colors"
                        >
                          {client.name}
                        </h3>
                        {client.vip && (
                          <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            VIP
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-atelier-muted font-medium">
                        {client.phone}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenClientProfile(client)}
                    className="p-1.5 rounded-xl hover:bg-atelier-cream text-atelier-muted hover:text-atelier-noir transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Social & Contact */}
                <div className="flex items-center gap-3 text-[11px] text-atelier-muted mb-3 font-medium">
                  {client.instagram && (
                    <span className="text-atelier-rose600 font-semibold">
                      {client.instagram}
                    </span>
                  )}
                  {client.email && (
                    <span className="truncate max-w-[150px]">{client.email}</span>
                  )}
                </div>

                {/* Nail Shape / Aesthetics Tags */}
                <div className="space-y-2 py-2.5 border-y border-atelier-champagneBorder/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-atelier-muted text-[10px]">Style Profile:</span>
                    <span className="font-semibold text-atelier-charcoal text-[11px]">
                      {client.preferredShape || 'Almond'} • {client.preferredLength || 'Medium'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-atelier-muted text-[10px]">Aesthetic:</span>
                    <span className="px-2 py-0.5 rounded-lg bg-atelier-rose50 text-atelier-rose600 font-semibold text-[10px] border border-atelier-rose200/60">
                      {client.preferredAesthetic || '3D Chrome'}
                    </span>
                  </div>

                  {client.allergies && client.allergies !== 'None reported' && (
                    <div className="flex items-center gap-1.5 p-1.5 bg-amber-50/70 rounded-lg text-[10px] text-amber-800 font-medium">
                      <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                      <span className="truncate">{client.allergies}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom: Lifetime stats & Action Buttons */}
              <div className="pt-3 mt-3 flex items-center justify-between gap-2">
                <div className="text-[11px] text-atelier-muted">
                  <span className="font-bold text-atelier-noir font-serif text-sm">
                    {client.totalVisits || 0}
                  </span>{' '}
                  visits •{' '}
                  <span className="font-bold text-atelier-noir font-serif text-sm">
                    ₹{(client.totalSpent || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onBookAppointment(client)}
                    title="Book Appointment"
                    className="px-2.5 py-1.5 rounded-xl bg-atelier-rose50 hover:bg-atelier-rose100 text-atelier-rose600 text-[11px] font-semibold border border-atelier-rose200 transition-colors"
                  >
                    Book
                  </button>
                  <button
                    onClick={() => onCreateInvoice(client)}
                    title="Generate Invoice"
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-atelier-cream text-atelier-charcoal text-[11px] font-semibold border border-atelier-champagneBorder transition-colors"
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

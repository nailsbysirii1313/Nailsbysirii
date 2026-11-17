import React, { useState } from 'react';
import { Sparkles, Clock, DollarSign, Check, Calendar, Receipt, RotateCcw } from 'lucide-react';
import { SHAPES, LENGTHS, BASE_COLORS, FINISHES, calculateCustomSet } from '../utils/customizerCalculator';
import NailTipSchematic from './NailTipSchematic';

export default function NailCustomizerView({
  onBookCustomDesign,
  onCreateInvoiceFromDesign,
  onSwitchToStudio
}) {
  const shapes = SHAPES;
  const lengths = LENGTHS;
  const baseColors = BASE_COLORS;
  const finishes = FINISHES;

  const [selectedShape, setSelectedShape] = useState(shapes[0]);
  const [selectedLength, setSelectedLength] = useState(lengths[1]);
  const [selectedBase, setSelectedBase] = useState(baseColors[1]);
  const [selectedFinish, setSelectedFinish] = useState(finishes[0]);

  // Pricing calculation from shared single source of truth
  const calculation = calculateCustomSet({
    length: selectedLength,
    finish: selectedFinish
  });
  const baseServicePrice = calculation.basePrice;
  const totalPrice = calculation.totalPrice;
  const totalDuration = calculation.totalDuration;

  const handleBook = () => {
    onBookCustomDesign({
      shape: selectedShape.name,
      length: selectedLength.name,
      baseColor: selectedBase.name,
      finish: selectedFinish.name,
      price: totalPrice,
      duration: totalDuration,
      lineItems: calculation.lineItems
    });
  };

  const handleCreateInvoice = () => {
    onCreateInvoiceFromDesign({
      shape: selectedShape.name,
      length: selectedLength.name,
      baseColor: selectedBase.name,
      finish: selectedFinish.name,
      price: totalPrice,
      duration: totalDuration,
      lineItems: calculation.lineItems
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-atelier-rose100 text-atelier-rose600 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Studio Consultation Tool</span>
          </div>
          <h2 className="font-serif italic font-bold text-2xl text-atelier-noir">
            Nail Set Customizer & Cost Calculator
          </h2>
          <p className="text-xs text-atelier-muted">
            Design custom nail sets in real-time, preview cute looks, and calculate appointment duration and pricing.
          </p>
        </div>

        <button
          onClick={onSwitchToStudio}
          className="px-4 py-2 rounded-xl bg-white border border-atelier-champagneBorder hover:bg-atelier-cream text-xs font-semibold text-atelier-charcoal shadow-sm"
        >
          Return to Studio OS
        </button>
      </div>

      {/* Main Grid: Customizer Controls (Left) & Live Visual Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Step-by-Step Selectors */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Shape */}
          <div className="bg-white rounded-3xl p-6 border border-atelier-champagneBorder shadow-sm space-y-3">
            <span className="text-xs font-bold text-atelier-noir uppercase tracking-wider block">
              1. Choose Nail Architecture & Shape
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {shapes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedShape(s)}
                  className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
                    selectedShape.id === s.id
                      ? 'border-atelier-rose500 bg-atelier-rose50/70 shadow-sm'
                      : 'border-atelier-champagneBorder bg-white hover:border-atelier-rose200'
                  }`}
                >
                  <span className="font-serif italic font-bold text-sm text-atelier-noir block">
                    {s.name}
                  </span>
                  <span className="text-[10px] text-atelier-muted leading-tight block mt-0.5">
                    {s.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Length */}
          <div className="bg-white rounded-3xl p-6 border border-atelier-champagneBorder shadow-sm space-y-3">
            <span className="text-xs font-bold text-atelier-noir uppercase tracking-wider block">
              2. Select Desired Length
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {lengths.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLength(l)}
                  className={`p-3.5 rounded-2xl border text-center text-xs transition-all ${
                    selectedLength.id === l.id
                      ? 'border-atelier-rose500 bg-atelier-rose500 text-white font-bold shadow-sm'
                      : 'border-atelier-champagneBorder bg-white hover:border-atelier-rose200 text-atelier-charcoal font-semibold'
                  }`}
                >
                  <span className="block">{l.name}</span>
                  <span
                    className={`text-[10px] block mt-0.5 ${
                      selectedLength.id === l.id ? 'text-white/80' : 'text-atelier-muted'
                    }`}
                  >
                    {l.extra > 0 ? `+₹${l.extra}` : 'Included'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Base Coat Palette */}
          <div className="bg-white rounded-3xl p-6 border border-atelier-champagneBorder shadow-sm space-y-3">
            <span className="text-xs font-bold text-atelier-noir uppercase tracking-wider block">
              3. Select Base Color Palette
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {baseColors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedBase(c)}
                  className={`p-3 rounded-2xl border flex items-center gap-3 text-xs transition-all ${
                    selectedBase.id === c.id
                      ? 'border-atelier-rose500 bg-atelier-rose50/60 shadow-sm'
                      : 'border-atelier-champagneBorder bg-white hover:border-atelier-rose200'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-full shadow-inner border shrink-0"
                    style={{ backgroundColor: c.hex, borderColor: c.border }}
                  />
                  <span className="font-semibold text-atelier-noir text-xs">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Finish & Nail Art Tier */}
          <div className="bg-white rounded-3xl p-6 border border-atelier-champagneBorder shadow-sm space-y-3">
            <span className="text-xs font-bold text-atelier-noir uppercase tracking-wider block">
              4. Cute Nail Art & Shimmer Finishes
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {finishes.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFinish(f)}
                  className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex items-start justify-between ${
                    selectedFinish.id === f.id
                      ? 'border-atelier-rose500 bg-atelier-rose50/70 shadow-sm'
                      : 'border-atelier-champagneBorder bg-white hover:border-atelier-rose200'
                  }`}
                >
                  <div>
                    <span className="font-serif italic font-bold text-sm text-atelier-noir block">
                      {f.name}
                    </span>
                    <span className="text-[10px] text-atelier-muted block mt-0.5">
                      {f.desc}
                    </span>
                  </div>
                  <span className="font-serif font-bold text-atelier-rose600 shrink-0 ml-2">
                    {f.price > 0 ? `+₹${f.price}` : 'Free'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Live Atelier Aesthetic Showcase & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-atelier-champagneBorder shadow-float space-y-6 sticky top-24">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-atelier-rose600 block">
                Live Custom Set Preview
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-atelier-rose50 text-atelier-rose600 font-bold border border-atelier-rose200">
                Illustrative Schematic Preview
              </span>
            </div>

            {/* Honest Illustrative Schematic Preview */}
            <div
              className="h-64 rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300 border border-atelier-champagneBorder bg-atelier-cream/50"
            >
              <NailTipSchematic
                shape={selectedShape}
                length={selectedLength}
                baseColor={selectedBase}
                finish={selectedFinish}
                size="md"
              />

              <div className="mt-3 relative z-10 space-y-1 p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-white/80 shadow-xs max-w-[220px]">
                <span className="font-serif italic font-bold text-sm text-atelier-noir block">
                  {selectedShape.name} • {selectedLength.name}
                </span>
                <span className="text-[10px] text-atelier-charcoal font-medium block">
                  {selectedBase.name} • {selectedFinish.name}
                </span>
              </div>
            </div>

            {/* Price & Time Summary */}
            <div className="p-4 rounded-2xl bg-atelier-blush border border-atelier-rose200/80 space-y-2 text-xs">
              <div className="flex justify-between text-atelier-muted">
                <span>Base BIAB Overlay:</span>
                <span className="font-semibold text-atelier-noir">₹{Number(baseServicePrice).toLocaleString('en-IN')}</span>
              </div>

              {selectedLength.extra > 0 && (
                <div className="flex justify-between text-atelier-muted">
                  <span>Length ({selectedLength.name}):</span>
                  <span className="font-semibold text-atelier-noir">+₹{Number(selectedLength.extra).toLocaleString('en-IN')}</span>
                </div>
              )}

              {selectedFinish.price > 0 && (
                <div className="flex justify-between text-atelier-muted">
                  <span>Art Tier ({selectedFinish.name}):</span>
                  <span className="font-semibold text-atelier-noir">+₹{Number(selectedFinish.price).toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-atelier-muted pt-2 border-t border-atelier-rose200">
                <span>Estimated Time:</span>
                <span className="font-semibold text-atelier-noir">{totalDuration} mins</span>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-atelier-rose200">
                <span className="font-bold text-atelier-noir">Calculated Total:</span>
                <span className="font-serif italic font-bold text-2xl text-atelier-rose600">
                  ₹{Number(totalPrice).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleBook}
                className="w-full py-3 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white font-semibold text-xs shadow-soft transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Custom Set</span>
              </button>

              <button
                onClick={handleCreateInvoice}
                className="w-full py-2.5 rounded-xl bg-white border border-atelier-champagneBorder hover:border-atelier-rose300 text-atelier-charcoal hover:text-atelier-noir font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Receipt className="w-4 h-4 text-atelier-rose500" />
                <span>Generate Client Invoice</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


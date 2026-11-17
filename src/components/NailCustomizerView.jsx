import React, { useState } from 'react';
import { Palette, Clock, DollarSign, Check, Calendar, Receipt, RotateCcw } from 'lucide-react';
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
    <div className="space-y-8 pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-subtle text-brand-wine text-xs font-semibold mb-2 border border-border-subtle">
            <Palette className="w-3.5 h-3.5 text-brand-wine" />
            <span>Interactive Studio Consultation Tool</span>
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-text-ink tracking-tight">
            Nail Set Customizer & Cost Calculator
          </h2>
          <p className="text-xs text-text-muted mt-1 max-w-xl">
            Design bespoke nail architectures in real-time, preview silhouettes, and calculate honest session duration and itemized pricing.
          </p>
        </div>

        <button
          onClick={onSwitchToStudio}
          className="px-4 py-2.5 rounded-xl bg-studio-surface border border-border-subtle hover:bg-studio-canvas text-xs font-semibold text-text-secondary hover:text-text-ink shadow-xs transition-colors min-h-[44px]"
        >
          Return to Studio Hub
        </button>
      </div>

      {/* Main Grid: Customizer Controls & Live Visual Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mobile: Preview first; Desktop: Right Column */}
        <div className="order-first lg:order-last space-y-6">
          <div className="bg-studio-surface rounded-3xl p-6 border border-border-subtle shadow-studio space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-wine block">
                Live Custom Set Preview
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-studio-subtle text-brand-wine font-bold border border-border-subtle">
                Illustrative Schematic
              </span>
            </div>

            {/* Honest Illustrative Schematic Preview */}
            <div
              className="h-64 rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300 border border-border-subtle bg-studio-canvas"
            >
              <NailTipSchematic
                shape={selectedShape}
                length={selectedLength}
                baseColor={selectedBase}
                finish={selectedFinish}
                size="md"
              />

              <div className="mt-3 relative z-10 space-y-0.5 p-3 bg-studio-surface/90 backdrop-blur-md rounded-2xl border border-border-subtle shadow-xs max-w-[220px]">
                <span className="font-display font-semibold text-sm text-text-ink block">
                  {selectedShape.name} • {selectedLength.name}
                </span>
                <span className="text-[11px] text-text-muted font-medium block">
                  {selectedBase.name} • {selectedFinish.name}
                </span>
              </div>
            </div>

            {/* Price & Time Summary */}
            <div className="p-4 rounded-2xl bg-studio-canvas border border-border-subtle space-y-2 text-xs">
              <div className="flex justify-between text-text-muted">
                <span>Base BIAB Overlay:</span>
                <span className="font-semibold text-text-secondary">₹{Number(baseServicePrice).toLocaleString('en-IN')}</span>
              </div>

              {selectedLength.extra > 0 && (
                <div className="flex justify-between text-text-muted">
                  <span>Length ({selectedLength.name}):</span>
                  <span className="font-semibold text-text-secondary">+₹{Number(selectedLength.extra).toLocaleString('en-IN')}</span>
                </div>
              )}

              {selectedFinish.price > 0 && (
                <div className="flex justify-between text-text-muted">
                  <span>Art Tier ({selectedFinish.name}):</span>
                  <span className="font-semibold text-text-secondary">+₹{Number(selectedFinish.price).toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-text-muted pt-2 border-t border-border-subtle">
                <span>Estimated Duration:</span>
                <span className="font-semibold text-text-ink">{totalDuration} mins</span>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-border-subtle">
                <span className="font-bold text-text-ink">Calculated Total:</span>
                <span className="font-display font-bold text-2xl text-brand-wine">
                  ₹{Number(totalPrice).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleBook}
                className="w-full py-3 rounded-xl bg-brand-wine hover:bg-brand-wineHover text-white font-semibold text-xs shadow-studio transition-all active:scale-95 flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Custom Set</span>
              </button>

              <button
                onClick={handleCreateInvoice}
                className="w-full py-2.5 rounded-xl bg-studio-surface border border-border-subtle hover:bg-studio-canvas text-text-secondary hover:text-text-ink font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Receipt className="w-4 h-4 text-brand-wine" />
                <span>Generate Client Invoice</span>
              </button>
            </div>
          </div>
        </div>

        {/* Left 2 Cols: Step-by-Step Selectors */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Shape */}
          <div className="bg-studio-surface rounded-3xl p-6 border border-border-subtle shadow-xs space-y-3">
            <span className="text-xs font-bold text-text-ink uppercase tracking-wider block">
              1. Choose Nail Architecture & Shape
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {shapes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedShape(s)}
                  className={`p-3.5 rounded-2xl border text-left text-xs transition-all min-h-[56px] ${
                    selectedShape.id === s.id
                      ? 'border-brand-wine bg-brand-wineLight ring-2 ring-brand-wine/20 shadow-xs'
                      : 'border-border-subtle bg-studio-surface hover:border-border-strong'
                  }`}
                >
                  <span className="font-display font-semibold text-sm text-text-ink block">
                    {s.name}
                  </span>
                  <span className="text-[10px] text-text-muted leading-tight block mt-0.5">
                    {s.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Length */}
          <div className="bg-studio-surface rounded-3xl p-6 border border-border-subtle shadow-xs space-y-3">
            <span className="text-xs font-bold text-text-ink uppercase tracking-wider block">
              2. Select Desired Length
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {lengths.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLength(l)}
                  className={`p-3.5 rounded-2xl border text-center text-xs transition-all min-h-[56px] ${
                    selectedLength.id === l.id
                      ? 'border-brand-wine bg-brand-wine text-white font-bold shadow-studio'
                      : 'border-border-subtle bg-studio-surface hover:border-border-strong text-text-secondary font-semibold'
                  }`}
                >
                  <span className="block">{l.name}</span>
                  <span
                    className={`text-[10px] block mt-0.5 ${
                      selectedLength.id === l.id ? 'text-white/80' : 'text-text-muted'
                    }`}
                  >
                    {l.extra > 0 ? `+₹${l.extra}` : 'Included'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Base Coat Palette */}
          <div className="bg-studio-surface rounded-3xl p-6 border border-border-subtle shadow-xs space-y-3">
            <span className="text-xs font-bold text-text-ink uppercase tracking-wider block">
              3. Select Base Tint Palette
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {baseColors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedBase(c)}
                  className={`p-3 rounded-2xl border flex items-center gap-3 text-xs transition-all min-h-[50px] ${
                    selectedBase.id === c.id
                      ? 'border-brand-wine bg-brand-wineLight ring-2 ring-brand-wine/20 shadow-xs'
                      : 'border-border-subtle bg-studio-surface hover:border-border-strong'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-full shadow-inner border shrink-0"
                    style={{ backgroundColor: c.hex, borderColor: c.border }}
                  />
                  <span className="font-semibold text-text-ink text-xs">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Finish & Nail Art Tier */}
          <div className="bg-studio-surface rounded-3xl p-6 border border-border-subtle shadow-xs space-y-3">
            <span className="text-xs font-bold text-text-ink uppercase tracking-wider block">
              4. Bespoke Finish & Nail Art Tier
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {finishes.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFinish(f)}
                  className={`p-3.5 rounded-2xl border text-left text-xs transition-all flex items-start justify-between min-h-[60px] ${
                    selectedFinish.id === f.id
                      ? 'border-brand-wine bg-brand-wineLight ring-2 ring-brand-wine/20 shadow-xs'
                      : 'border-border-subtle bg-studio-surface hover:border-border-strong'
                  }`}
                >
                  <div>
                    <span className="font-display font-semibold text-sm text-text-ink block">
                      {f.name}
                    </span>
                    <span className="text-[10px] text-text-muted block mt-0.5">
                      {f.desc}
                    </span>
                  </div>
                  <span className="font-display font-bold text-brand-wine shrink-0 ml-2">
                    {f.price > 0 ? `+₹${f.price}` : 'Free'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

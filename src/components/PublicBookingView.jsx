import React from 'react';
import ClientWebsite from './ClientWebsite';
import { ArrowLeft } from 'lucide-react';

export default function PublicBookingView({
  services,
  settings,
  reviews,
  pressOnProducts = [],
  onOrderPressOn,
  onBookingComplete,
  onSubmitRepair,
  onSaveReview,
  onSwitchToStudio,
  onAddToast
}) {
  return (
    <div className="space-y-4 animate-fade-in pb-16">
      {/* Studio Hub Top Banner */}
      <div className="bg-studio-surface border border-border-subtle rounded-2xl p-3.5 flex items-center justify-between text-xs shadow-xs">
        <div className="flex items-center gap-2 text-text-ink">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="font-semibold">Public Client Website Preview</span>
          <span className="text-text-muted hidden sm:inline">
            • Live customer-facing booking and catalogue experience
          </span>
        </div>
        <button
          onClick={onSwitchToStudio}
          className="px-3.5 py-2 rounded-xl bg-studio-canvas border border-border-subtle hover:bg-studio-subtle text-text-ink font-semibold transition-all text-xs flex items-center gap-1.5 min-h-[38px]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-brand-wine" />
          <span>Return to Studio Hub</span>
        </button>
      </div>

      {/* Render the verified modern ClientWebsite experience */}
      <ClientWebsite
        services={services}
        settings={settings}
        reviews={reviews}
        pressOnProducts={pressOnProducts}
        onOrderPressOn={onOrderPressOn}
        hidePrices={false}
        setHidePrices={() => {}}
        onOpenPasscodeModal={onSwitchToStudio}
        onBookingComplete={onBookingComplete}
        onSubmitRepair={onSubmitRepair}
        onSaveReview={onSaveReview}
        onAddToast={onAddToast}
      />
    </div>
  );
}

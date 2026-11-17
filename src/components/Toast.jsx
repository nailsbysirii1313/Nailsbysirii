import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-atelier-champagneBorder shadow-float transition-all transform translate-y-0"
          >
            <div className="flex-shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-atelier-rose500" />}
              {isError && <AlertCircle className="w-5 h-5 text-red-500" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-atelier-gold" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-atelier-noir">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-atelier-muted mt-0.5 break-words">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="flex-shrink-0 text-atelier-muted hover:text-atelier-noir transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}


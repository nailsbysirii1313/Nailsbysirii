import React, { useState, useEffect, useRef } from 'react';
import { Lock, KeyRound, Eye, EyeOff, Sparkles, ArrowRight, X, AlertCircle } from 'lucide-react';
import StudioLogo from './StudioLogo';
import { api } from '../api';
import { playStudioChime } from '../utils/audio';

export default function PasscodeModal({
  isOpen,
  onClose,
  onSuccess,
  settings
}) {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPasscode('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Please enter your studio passcode');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // First verify against local standard nbs0812 or server endpoint
      const res = await api.verifyPasscode(passcode.trim()).catch((err) => {
        // Fallback check if offline
        if (passcode.trim() === 'nbs0812' || passcode.trim() === settings?.studioPasscode) {
          return { success: true };
        }
        throw err;
      });

      if (res.success) {
        localStorage.setItem('nbs_studio_auth', 'true');
        playStudioChime();
        onSuccess();
        onClose();
      } else {
        setError(res.error || 'Incorrect passcode. Access denied.');
      }
    } catch (err) {
      setError(err.message || 'Incorrect passcode. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-atelier-noir/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-atelier-rose200/80 space-y-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-atelier-rose100 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-atelier-champagne rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-atelier-cream/80 hover:bg-atelier-rose50 flex items-center justify-center text-atelier-charcoal hover:text-atelier-rose600 transition-colors"
          title="Return to client website"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Branding & Lock Icon */}
        <div className="text-center space-y-3 relative pt-2">
          <div className="flex flex-col items-center justify-center gap-2">
            <StudioLogo logoUrl={settings?.studioLogoUrl} size="lg" className="justify-center" />
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-atelier-rose50 border border-atelier-rose200 text-atelier-rose600 text-[10px] font-bold uppercase tracking-wider">
              <Lock className="w-3 h-3" />
              <span>Owner Workspace</span>
            </div>
          </div>

          <div>
            <h2 className="font-serif italic font-bold text-2xl text-atelier-noir">
              Studio Hub Access
            </h2>
            <p className="text-xs text-atelier-muted max-w-xs mx-auto mt-1 leading-relaxed">
              Enter your owner passcode to access client bookings, schedule, invoices, inventory, and studio reports.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-atelier-charcoal">
              Studio Passcode
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-atelier-muted">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                ref={inputRef}
                type={showPasscode ? 'text' : 'password'}
                placeholder="Enter passcode (e.g. nbs0812)"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full pl-10 pr-11 py-3 bg-atelier-cream/60 border rounded-2xl text-base sm:text-sm font-medium tracking-wider focus:outline-none focus:bg-white transition-all ${
                  error
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                    : 'border-atelier-champagneBorder focus:border-atelier-rose400 focus:ring-2 focus:ring-atelier-rose100'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-atelier-muted hover:text-atelier-noir transition-colors"
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error ? (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 pt-1 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            ) : (
              <p className="text-[10px] text-atelier-muted pt-0.5">
                Private keyholder passcode for Sirii.
              </p>
            )}
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-atelier-rose500 to-atelier-rose600 hover:from-atelier-rose600 hover:to-atelier-rose500 text-white text-xs font-semibold shadow-soft hover:shadow-float active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Verifying Passcode...</span>
                </>
              ) : (
                <>
                  <span>Unlock Studio Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-2xl bg-atelier-cream/80 hover:bg-atelier-cream border border-atelier-champagneBorder/60 text-atelier-charcoal text-xs font-semibold transition-all"
            >
              Return to Public Client Website
            </button>
          </div>
        </form>

        <div className="pt-3 border-t border-atelier-champagneBorder/60 text-center">
          <p className="text-[10px] text-atelier-muted">
            Nails by Sirii • Owner Dashboard (Protected)
          </p>
        </div>
      </div>
    </div>
  );
}

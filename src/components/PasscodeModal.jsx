import React, { useState, useEffect, useRef } from 'react';
import ModalPortal from './ModalPortal';
import { Lock, KeyRound, Eye, EyeOff, ArrowRight, X, AlertCircle } from 'lucide-react';
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
      const res = await api.verifyPasscode(passcode.trim());

      if (res.success) {
        if (res.token) {
          localStorage.setItem('nbs_studio_token', res.token);
        }
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
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      {/* Dedicated full-bleed non-scrolling backdrop */}
      <div
        className="fixed inset-0 z-[70] bg-studio-ink/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Scrollable floating dialog container */}
      <div
        className="fixed inset-0 z-[71] p-3 sm:p-4 flex items-center justify-center animate-in fade-in duration-200"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="bg-studio-surface rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-studio-float border border-studio-border space-y-6 relative overflow-hidden my-auto max-h-[90vh] sm:max-h-[85vh] overflow-y-auto overscroll-contain"
        >
        {/* Decorative background glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-studio-wineLight rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-studio-subtle rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-studio-subtle hover:bg-studio-wineLight flex items-center justify-center text-studio-secondary hover:text-studio-wine transition-colors"
          title="Return to client website"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Branding & Lock Icon */}
        <div className="text-center space-y-3 relative pt-2">
          <div className="flex flex-col items-center justify-center gap-2">
            <StudioLogo logoUrl={settings?.studioLogoUrl} size="lg" className="justify-center" />
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-studio-wineLight border border-studio-border text-studio-wine text-[10px] font-bold uppercase tracking-wider">
              <Lock className="w-3 h-3" />
              <span>Owner Workspace</span>
            </div>
          </div>

          <div>
            <h2 className="font-display italic font-bold text-2xl text-studio-ink">
              Studio Hub Access
            </h2>
            <p className="text-xs text-studio-secondary max-w-xs mx-auto mt-1 leading-relaxed">
              Enter your owner passcode to access client bookings, schedule, invoices, inventory, and studio reports.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative font-sans">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-studio-secondary">
              Studio Passcode
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-studio-muted">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                ref={inputRef}
                type={showPasscode ? 'text' : 'password'}
                placeholder="Enter studio passcode"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full pl-10 pr-11 py-3 bg-studio-canvas/50 border rounded-2xl text-base sm:text-sm font-medium tracking-wider focus:outline-none focus:bg-studio-surface transition-all ${
                  error
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                    : 'border-studio-border focus:border-studio-wine focus:ring-2 focus:ring-studio-wineLight'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-studio-muted hover:text-studio-ink transition-colors"
                aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
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
              <p className="text-[10px] text-studio-muted pt-0.5">
                Private keyholder passcode for studio owner.
              </p>
            )}
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 px-4 rounded-2xl bg-studio-wine hover:bg-studio-wineHover text-white text-xs font-semibold shadow-studio hover:shadow-studio-float active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
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
              className="w-full py-2.5 px-4 rounded-2xl bg-studio-subtle hover:bg-studio-canvas border border-studio-border text-studio-secondary text-xs font-semibold transition-all"
            >
              Return to Public Client Website
            </button>
          </div>
        </form>

        <div className="pt-3 border-t border-studio-border text-center">
          <p className="text-[10px] text-studio-muted">
            Nails by Sirii • Owner Dashboard (Protected)
          </p>
        </div>
      </div>
    </div>
  
</ModalPortal>
  );
}

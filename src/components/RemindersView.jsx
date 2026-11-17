import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  BellRing,
  Smartphone,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Clock,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  Volume2
} from 'lucide-react';

export default function RemindersView({
  settings,
  notifications = [],
  onUpdateSettings,
  onSendTestNotification,
  onRefreshNotifications
}) {
  const [topicInput, setTopicInput] = useState(settings?.ntfyTopic || 'nails-by-sirii-alerts');
  const [leadHours, setLeadHours] = useState(settings?.reminderLeadHours || 2);
  const [autoEnabled, setAutoEnabled] = useState(Boolean(settings?.autoRemindersEnabled ?? true));
  const [savingSettings, setSavingSettings] = useState(false);

  // Test push notification state
  const [testTitle, setTestTitle] = useState('Nails by Sirii • Client Alert');
  const [testMessage, setTestMessage] = useState(
    'Studio test alert: Phone notification service is connected and ready for live bookings.'
  );
  const [testPriority, setTestPriority] = useState('high');
  const [sendingTest, setSendingTest] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (settings) {
      if (settings.ntfyTopic) setTopicInput(settings.ntfyTopic);
      if (settings.reminderLeadHours !== undefined) setLeadHours(settings.reminderLeadHours);
      if (settings.autoRemindersEnabled !== undefined) setAutoEnabled(Boolean(settings.autoRemindersEnabled));
    }
  }, [settings]);

  const server = settings?.ntfyServer || 'https://ntfy.sh';
  const subscribeUrl = `${server.replace(/\/$/, '')}/${topicInput}`;

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    await onUpdateSettings({
      ntfyTopic: topicInput.trim(),
      reminderLeadHours: Number(leadHours),
      autoRemindersEnabled: autoEnabled
    });
    setSavingSettings(false);
  };

  const handleSendTest = async (e) => {
    e.preventDefault();
    setSendingTest(true);
    await onSendTestNotification({
      topic: topicInput.trim(),
      title: testTitle,
      message: testMessage,
      priority: testPriority
    });
    setSendingTest(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(subscribeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12 max-w-6xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-canvas border border-border-subtle text-brand-wine text-xs font-semibold mb-2">
            <BellRing className="w-3.5 h-3.5" />
            <span>Mobile Push Notification Service</span>
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-text-ink tracking-tight">
            Phone Reminders & NTFY Hub
          </h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-2xl mt-1 leading-relaxed">
            Instant push alerts dispatched straight to your phone or smartwatch when clients book, request emergency repairs, or require appointment reminders. No SMS fees or third-party gateways.
          </p>
        </div>

        <button
          onClick={onRefreshNotifications}
          className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-studio-surface border border-border-subtle hover:bg-studio-canvas text-text-ink text-xs font-semibold shadow-xs transition-all flex items-center gap-2 min-h-[44px]"
        >
          <RefreshCw className="w-3.5 h-3.5 text-brand-wine" />
          <span>Refresh Alerts</span>
        </button>
      </div>

      {/* Grid: 2 Columns on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Phone Pairing & NTFY Setup */}
        <div className="bg-studio-surface rounded-3xl p-5 sm:p-7 border border-border-subtle shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-studio-canvas border border-border-subtle text-brand-wine flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base text-text-ink">
                  Pair Your Phone
                </h3>
                <p className="text-xs text-text-muted">1-tap setup with the free NTFY app</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Active</span>
            </span>
          </div>

          {/* QR Code and Quick Pairing Box */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-studio-canvas/70 border border-border-subtle">
            <div className="p-3 bg-white rounded-2xl shadow-xs border border-border-subtle shrink-0">
              <QRCodeSVG value={subscribeUrl} size={130} level="H" fgColor="#1C1917" />
            </div>

            <div className="space-y-2 text-xs text-center sm:text-left flex-1">
              <span className="font-semibold text-text-ink text-sm block">
                Scan with phone camera
              </span>
              <p className="text-text-muted leading-relaxed text-xs">
                Opens your private notification feed. Tap <strong>Subscribe</strong> in the free NTFY app (iOS or Android) to receive instant studio push notifications.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <a
                  href={subscribeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-studio-surface border border-border-subtle text-xs font-semibold text-text-ink hover:bg-studio-subtle transition-colors shadow-xs min-h-[38px]"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-brand-wine" />
                  <span>Open Feed URL</span>
                </a>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-studio-surface border border-border-subtle text-xs font-semibold text-text-ink hover:bg-studio-subtle transition-colors shadow-xs min-h-[38px]"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-text-muted" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSaveSettings} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-text-ink mb-1">
                Your Private NTFY Topic Name
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-text-muted text-xs sm:text-sm">ntfy.sh/</span>
                <input
                  type="text"
                  required
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/50 focus:bg-white focus:border-brand-wine outline-none font-mono text-base sm:text-xs font-semibold text-text-ink"
                />
              </div>
              <p className="text-[11px] text-text-muted mt-1.5">
                Keep this topic unique and confidential to ensure client alerts remain private to your device.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-ink mb-1">
                  Reminder Advance Time
                </label>
                <select
                  value={leadHours}
                  onChange={(e) => setLeadHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-surface text-text-ink outline-none text-base sm:text-xs font-medium"
                >
                  <option value={1}>1 hour prior</option>
                  <option value={2}>2 hours prior (Recommended)</option>
                  <option value={4}>4 hours prior</option>
                  <option value={12}>12 hours prior</option>
                  <option value={24}>24 hours (1 day) prior</option>
                </select>
              </div>

              <div className="flex items-center pt-2 sm:pt-6">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoEnabled}
                    onChange={(e) => setAutoEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-wine focus:ring-brand-wine border-border-subtle accent-brand-wine"
                  />
                  <span className="font-semibold text-text-ink text-xs">
                    Enable Background Auto-Alerts
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="w-full py-3 rounded-2xl bg-text-ink hover:bg-stone-800 text-white font-semibold text-xs transition-all shadow-xs disabled:opacity-50 min-h-[44px]"
            >
              {savingSettings ? 'Saving Settings...' : 'Save Notification Preferences'}
            </button>
          </form>
        </div>

        {/* Right Column: Live Push Alert Dispatcher */}
        <div className="bg-studio-surface rounded-3xl p-5 sm:p-7 border border-border-subtle shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-studio-canvas border border-border-subtle text-brand-wine flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base text-text-ink">
                  Live Alert Dispatcher
                </h3>
                <p className="text-xs text-text-muted">
                  Send immediate test push notifications to your paired device
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSendTest} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-ink mb-1">
                Notification Headline
              </label>
              <input
                type="text"
                required
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/50 focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs text-text-ink font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-ink mb-1">
                Message Body
              </label>
              <textarea
                rows={3}
                required
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas/50 focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs text-text-ink font-medium leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-ink mb-1">
                Notification Priority
              </label>
              <select
                value={testPriority}
                onChange={(e) => setTestPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-studio-surface text-text-ink outline-none text-base sm:text-xs font-medium"
              >
                <option value="high">High (Rings phone & pops up on screen)</option>
                <option value="urgent">Urgent (Vibrates continuously)</option>
                <option value="default">Default</option>
                <option value="low">Low (Silent delivery)</option>
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-studio-canvas/70 border border-border-subtle text-xs text-text-muted space-y-1.5">
              <span className="font-semibold text-text-ink flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-brand-wine" />
                <span>How notifications sound on your device:</span>
              </span>
              <p className="leading-relaxed">
                When triggered, NTFY rings your phone displaying the client name, requested service, and appointment time. Tapping the notification opens this Studio Hub directly.
              </p>
            </div>

            <button
              type="submit"
              disabled={sendingTest}
              className="w-full py-3.5 rounded-2xl bg-brand-wine hover:bg-brand-wine/90 text-white font-semibold text-xs sm:text-sm transition-all shadow-studio active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Send className={`w-4 h-4 ${sendingTest ? 'animate-bounce' : ''}`} />
              <span>{sendingTest ? 'Dispatching Push Alert...' : 'Send Push Alert to Phone Now'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Dispatched Notification History */}
      <div className="bg-studio-surface rounded-3xl p-5 sm:p-7 border border-border-subtle shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div>
            <h3 className="font-display font-semibold text-lg text-text-ink">
              Dispatched Notification History
            </h3>
            <p className="text-xs text-text-muted">
              Live transmission log of all phone alerts sent to Sirii's device
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-wine">
            {notifications.length} logged
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <BellRing className="w-8 h-8 text-text-muted/40 mx-auto" />
            <p className="text-xs text-text-muted italic">
              No notifications sent yet. Dispatch a test alert above to verify delivery.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-4 rounded-2xl bg-studio-canvas/50 border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-studio-surface border border-border-subtle text-brand-wine flex items-center justify-center shrink-0 mt-0.5">
                    <BellRing className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-text-ink text-sm block">
                      {notif.title}
                    </span>
                    <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-text-muted/80 font-mono mt-1 block">
                      Topic: {notif.topic}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 shrink-0">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      notif.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {notif.status}
                  </span>
                  <span className="text-[10px] text-text-muted font-medium">
                    {new Intl.DateTimeFormat('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(new Date(notif.sentAt))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

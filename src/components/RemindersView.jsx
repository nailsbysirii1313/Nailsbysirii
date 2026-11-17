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
  RefreshCw
} from 'lucide-react';

export default function RemindersView({
  settings,
  notifications,
  onUpdateSettings,
  onSendTestNotification,
  onRefreshNotifications
}) {
  const [topicInput, setTopicInput] = useState(settings?.ntfyTopic || 'nails-by-sirii-alerts');
  const [leadHours, setLeadHours] = useState(settings?.reminderLeadHours || 2);
  const [autoEnabled, setAutoEnabled] = useState(Boolean(settings?.autoRemindersEnabled ?? true));
  const [savingSettings, setSavingSettings] = useState(false);

  // Test form state
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
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-atelier-rose100 text-atelier-rose600 text-xs font-semibold mb-2">
          <BellRing className="w-3.5 h-3.5" />
          <span>Mobile Push Notification Engine</span>
        </div>
        <h2 className="font-serif italic font-bold text-2xl text-atelier-noir">
          Phone Reminders & NTFY Hub
        </h2>
        <p className="text-xs text-atelier-muted max-w-2xl leading-relaxed">
          Stay reminded of client appointments wherever you are. Nails by Sirii sends native push alerts straight to your iPhone, Android, or smartwatch without requiring any third-party paid SMS gateway.
        </p>
      </div>

      {/* Grid: Setup & QR Code on Left, Live Tester on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Phone Connection & QR Code */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-atelier-champagneBorder shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-atelier-champagneBorder/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-atelier-rose50 text-atelier-rose500 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif italic font-bold text-base text-atelier-noir">
                  Connect Your Phone
                </h3>
                <p className="text-[11px] text-atelier-muted">1-tap setup with Ntify</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Connected
            </span>
          </div>

          {/* QR Code and Topic URL */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-atelier-rose50/50 border border-atelier-rose200/60">
            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-atelier-champagneBorder shrink-0">
              <QRCodeSVG value={subscribeUrl} size={140} level="H" fgColor="#231F20" />
            </div>

            <div className="space-y-2 text-xs text-center sm:text-left">
              <span className="font-semibold text-atelier-noir block">
                Scan with your phone camera
              </span>
              <p className="text-[11px] text-atelier-muted leading-relaxed">
                Opens your private notification feed. Tap <strong>"Subscribe"</strong> in the free Ntify app to allow alerts.
              </p>
              <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                <a
                  href={subscribeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-atelier-champagneBorder text-[11px] font-semibold text-atelier-charcoal hover:bg-atelier-cream transition-colors shadow-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open Feed</span>
                </a>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-atelier-champagneBorder text-[11px] font-semibold text-atelier-charcoal hover:bg-atelier-cream transition-colors shadow-sm"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Topic & Auto Reminder Settings Form */}
          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs pt-2">
            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Your Private NTFY Topic Name
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-atelier-muted text-xs">ntfy.sh/</span>
                <input
                  type="text"
                  required
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none font-mono text-xs font-medium"
                />
              </div>
              <p className="text-[10px] text-atelier-muted mt-1">
                Pick any unique name (e.g. nails-by-sirii-alerts-2026). Keep it private to yourself.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-atelier-charcoal mb-1">
                  Reminder Advance Time
                </label>
                <select
                  value={leadHours}
                  onChange={(e) => setLeadHours(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder bg-white outline-none text-xs"
                >
                  <option value={1}>1 hour before appointment</option>
                  <option value={2}>2 hours before appointment (Recommended)</option>
                  <option value={4}>4 hours before appointment</option>
                  <option value={12}>12 hours before appointment</option>
                  <option value={24}>24 hours (1 day) before</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoEnabled}
                    onChange={(e) => setAutoEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-atelier-rose500 focus:ring-atelier-rose400 border-atelier-champagneBorder accent-atelier-rose500"
                  />
                  <span className="font-semibold text-atelier-noir text-xs">
                    Enable Background Auto Reminders
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="w-full py-2.5 rounded-xl bg-atelier-noir hover:bg-atelier-charcoal text-white font-semibold text-xs transition-all shadow-sm disabled:opacity-50"
            >
              {savingSettings ? 'Saving Settings...' : 'Save Notification Preferences'}
            </button>
          </form>
        </div>

        {/* Right Column: Live Push Alert Tester */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-atelier-champagneBorder shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-atelier-champagneBorder/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-atelier-rose100 text-atelier-rose600 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif italic font-bold text-base text-atelier-noir">
                  Live Alert Dispatcher
                </h3>
                <p className="text-[11px] text-atelier-muted">
                  Send immediate test push notifications to your phone
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSendTest} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Notification Headline
              </label>
              <input
                type="text"
                required
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Message Body
              </label>
              <textarea
                rows={3}
                required
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Notification Priority
              </label>
              <select
                value={testPriority}
                onChange={(e) => setTestPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder bg-white outline-none text-xs"
              >
                <option value="high">High (Rings phone & pops up)</option>
                <option value="urgent">Urgent (Vibrates continuously)</option>
                <option value="default">Default</option>
                <option value="low">Low (Silent)</option>
              </select>
            </div>

            <div className="p-3.5 rounded-2xl bg-atelier-blush border border-atelier-rose200/80 text-[11px] text-atelier-muted space-y-1">
              <span className="font-bold text-atelier-rose600 block">
                How notifications sound on your phone:
              </span>
              <p>
                When triggered, Ntify displays the client's name, requested service, and appointment time. You can tap the notification on your phone to open this studio dashboard.
              </p>
            </div>

            <button
              type="submit"
              disabled={sendingTest}
              className="w-full py-3 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white font-semibold text-xs transition-all shadow-soft active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className={`w-3.5 h-3.5 ${sendingTest ? 'animate-bounce' : ''}`} />
              <span>{sendingTest ? 'Dispatching Alert...' : 'Send Push Alert to Phone Now'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Notification Activity History Log */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-atelier-champagneBorder shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-atelier-champagneBorder/60">
          <div>
            <h3 className="font-serif italic font-bold text-lg text-atelier-noir">
              Dispatched Notification History
            </h3>
            <p className="text-xs text-atelier-muted">
              Live transmission log of all phone alerts sent to Sirii's device.
            </p>
          </div>
          <button
            onClick={onRefreshNotifications}
            className="p-2 rounded-xl border border-atelier-champagneBorder text-atelier-charcoal hover:bg-atelier-cream text-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {notifications.length === 0 ? (
          <p className="text-xs text-atelier-muted py-6 text-center italic">
            No notifications sent yet. Send a test alert to see it logged here.
          </p>
        ) : (
          <div className="space-y-2.5">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-3.5 rounded-2xl bg-atelier-cream/50 border border-atelier-champagneBorder flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-atelier-rose100 text-atelier-rose600 flex items-center justify-center shrink-0 mt-0.5">
                    <BellRing className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-atelier-noir block">
                      {notif.title}
                    </span>
                    <p className="text-[11px] text-atelier-charcoal mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-atelier-muted font-mono mt-1 block">
                      Topic: {notif.topic}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      notif.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {notif.status}
                  </span>
                  <span className="text-[10px] text-atelier-muted">
                    {new Intl.DateTimeFormat('en-US', {
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


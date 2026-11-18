// Asia/Kolkata Timezone & Studio Operating Hours Utilities

export const STUDIO_TIMEZONE = 'Asia/Kolkata';
export const STUDIO_OPENING_TIME = '12:00'; // 12:00 PM IST
export const STUDIO_CLOSING_TIME = '19:00'; // 7:00 PM IST

/**
 * Returns current calendar date in Asia/Kolkata as YYYY-MM-DD
 */
export function getKolkataTodayString() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: STUDIO_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(new Date());
}

/**
 * Returns tomorrow's calendar date in Asia/Kolkata as YYYY-MM-DD
 */
export function getKolkataTomorrowString() {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: STUDIO_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(tomorrow);
}

/**
 * Returns a date object converted to YYYY-MM-DD in Asia/Kolkata
 */
export function getKolkataDateString(date = new Date()) {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return getKolkataTodayString();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: STUDIO_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(d);
}

/**
 * Formats YYYY-MM-DD to a human-readable string in Asia/Kolkata
 */
export function formatKolkataDate(dateStr, options = { weekday: 'short', month: 'short', day: 'numeric' }) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;
  const d = new Date(year, month - 1, day, 12, 0, 0);
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: STUDIO_TIMEZONE,
    ...options
  }).format(d);
}

/**
 * Convert HH:mm to minutes from midnight
 */
export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Convert minutes from midnight to HH:mm
 */
export function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Format 24h time string (e.g. "14:30") to 12h time (e.g. "2:30 PM")
 */
export function formatTime12h(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = (h >= 12) ? 'PM' : 'AM';
  const hour12 = (h % 12 === 0) ? 12 : (h % 12);
  const minuteStr = String(m || 0).padStart(2, '0');
  return `${hour12}:${minuteStr} ${period}`;
}

/**
 * Standard Studio Base Slots (Starting at 12:00 PM opening)
 */
export const STANDARD_STUDIO_SLOTS = [
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '17:30'
];

/**
 * Returns slots that finish at or before STUDIO_CLOSING_TIME (19:00) given duration
 */
export function getAvailableSlotsForDuration(durationMinutes = 60, slots = STANDARD_STUDIO_SLOTS) {
  const closingMinutes = timeToMinutes(STUDIO_CLOSING_TIME);
  return slots.filter((slot) => {
    const startMins = timeToMinutes(slot);
    return startMins >= timeToMinutes(STUDIO_OPENING_TIME) && (startMins + durationMinutes) <= closingMinutes;
  });
}

/**
 * Convert appointment date & time to Unix milliseconds (Asia/Kolkata)
 */
export function getAppointmentTimeMs(apt) {
  if (!apt || !apt.date) return null;
  const timeStr = apt.time || '12:00';
  const [y, m, d] = apt.date.split('-').map(Number);
  const [h, min] = timeStr.split(':').map(Number);
  if (!y || !m || !d || isNaN(h)) return null;

  const pad = (n) => String(n).padStart(2, '0');
  const iso = `${y}-${pad(m)}-${pad(d)}T${pad(h)}:${pad(min || 0)}:00+05:30`;
  const time = new Date(iso).getTime();
  return isNaN(time) ? null : time;
}

/**
 * Checks if appointment scheduled time has arrived/passed
 */
export function isAppointmentTimePassed(apt, now = new Date()) {
  const timeMs = getAppointmentTimeMs(apt);
  if (!timeMs) return false;
  return now.getTime() >= timeMs;
}

/**
 * Returns elapsed hours since the appointment scheduled time
 */
export function getAppointmentElapsedHours(apt, now = new Date()) {
  const timeMs = getAppointmentTimeMs(apt);
  if (!timeMs) return -999;
  return (now.getTime() - timeMs) / (1000 * 60 * 60);
}

/**
 * Checks if appointment is within the 12-hour grace period after hitting its scheduled time
 */
export function isWithin12HoursAfterAppointment(apt, now = new Date()) {
  const elapsed = getAppointmentElapsedHours(apt, now);
  return elapsed >= 0 && elapsed <= 12;
}

/**
 * Checks if appointment should be visible in the active today/studio schedule board:
 * 1. Future appointment scheduled for today, OR
 * 2. Past appointment whose scheduled time arrived, but less than or equal to 12 hours ago!
 * (Once > 12 hours have elapsed, it vanishes from the active schedule view)
 */
export function isAppointmentActiveInSchedule(apt, now = new Date()) {
  const timeMs = getAppointmentTimeMs(apt);
  if (!timeMs) return false;
  const nowMs = now.getTime();
  const diffMs = timeMs - nowMs;
  const elapsedHours = (nowMs - timeMs) / (1000 * 60 * 60);

  // Future appointment:
  if (diffMs > 0) {
    const todayStr = getKolkataDateString(now);
    return apt.date === todayStr;
  }

  // Appointment time has arrived/passed:
  // Must stay visible for 12 hours, then vanish!
  return elapsedHours <= 12;
}

/**
 * Returns hours remaining in the 12-hour grace window
 */
export function getRemainingGraceHours(apt, now = new Date()) {
  const elapsed = getAppointmentElapsedHours(apt, now);
  if (elapsed < 0 || elapsed > 12) return 0;
  return Math.max(0, 12 - elapsed);
}

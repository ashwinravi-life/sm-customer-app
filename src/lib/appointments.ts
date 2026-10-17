import type { Appointment, Store } from '@/data/types';
import { formatClock } from '@/lib/stores';

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const pad = (n: number) => String(n).padStart(2, '0');

export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function parseISODate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export interface BookingDay {
  iso: string;
  label: string;
  day: number;
  month: string;
}

export function nextDays(count: number, from = new Date()): BookingDay[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    return {
      iso: toISODate(d),
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DAY_SHORT[d.getDay()],
      day: d.getDate(),
      month: MONTH_SHORT[d.getMonth()],
    };
  });
}

export interface Slot {
  time: string;
  label: string;
  available: boolean;
}

const SLOT_MINUTES = 30;
// Need at least this much notice to book a same-day slot.
const LEAD_MINUTES = 30;

// Prototype stand-in for the store's real calendar: deterministically mark
// some slots as already taken so the grid looks realistic.
function isTaken(storeId: string, date: string, time: string) {
  const key = `${storeId}${date}${time}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return Math.abs(hash) % 4 === 0;
}

export function slotsFor(store: Store, date: string, now = new Date()): Slot[] {
  const [openH, openM] = store.opensAt.split(':').map(Number);
  const [closeH, closeM] = store.closesAt.split(':').map(Number);
  const isToday = date === toISODate(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const slots: Slot[] = [];
  // Last slot starts 30 minutes before closing.
  for (let m = openH * 60 + openM; m <= closeH * 60 + closeM - SLOT_MINUTES; m += SLOT_MINUTES) {
    const time = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
    const tooSoon = isToday && m < nowMinutes + LEAD_MINUTES;
    slots.push({ time, label: formatClock(time), available: !tooSoon && !isTaken(store.id, date, time) });
  }
  return slots;
}

export function slotPeriod(time: string): 'Morning' | 'Afternoon' | 'Evening' {
  const h = Number(time.split(':')[0]);
  return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
}

export function formatAppointmentDate(date: string) {
  const d = parseISODate(date);
  const today = toISODate(new Date());
  const tomorrow = toISODate(new Date(Date.now() + 86_400_000));
  const prefix = date === today ? 'Today' : date === tomorrow ? 'Tomorrow' : DAY_SHORT[d.getDay()];
  return `${prefix}, ${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`;
}

export const formatAppointment = (a: Pick<Appointment, 'date' | 'time'>) =>
  `${formatAppointmentDate(a.date)} · ${formatClock(a.time)}`;

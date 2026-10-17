const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Parses YYYY-MM-DD as a local date (new Date('YYYY-MM-DD') would be UTC).
function parseDate(isoDate: string) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDate(isoDate: string) {
  const date = parseDate(isoDate);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatShortDate(isoDate: string) {
  const date = parseDate(isoDate);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function formatRupees(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatNumber(value: number) {
  return value.toLocaleString('en-IN');
}

export function daysUntil(isoDate: string, from = new Date()) {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((parseDate(isoDate).getTime() - today.getTime()) / 86_400_000);
}

export function greeting(now = new Date()) {
  const hour = now.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

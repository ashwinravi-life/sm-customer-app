import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { coinEntries as initialEntries, customer as mockCustomer, TIERS } from '@/data/mock';
import type { Appointment, CoinEntry, Customer, Tier } from '@/data/types';

export interface Redemption {
  code: string;
  coins: number;
  expiresAt: number;
}

interface AppState {
  customer: Customer | null;
  signIn: (mobile: string) => void;
  signOut: () => void;
  coinBalance: number;
  lifetimeCoins: number;
  tier: Tier;
  nextTier: { tier: Tier; coinsNeeded: number; progress: number } | null;
  coinEntries: CoinEntry[];
  activeRedemption: Redemption | null;
  redeemCoins: (coins: number) => Redemption;
  clearRedemption: () => void;
  appointments: Appointment[];
  bookAppointment: (appointment: Omit<Appointment, 'id'>) => Appointment;
  cancelAppointment: (id: string) => void;
}

const AppStateContext = createContext<AppState | null>(null);

const REDEMPTION_VALID_MS = 15 * 60 * 1000;

function makeRedemptionCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function today() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [entries, setEntries] = useState<CoinEntry[]>(initialEntries);
  const [activeRedemption, setActiveRedemption] = useState<Redemption | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const value = useMemo<AppState>(() => {
    const coinBalance = entries.reduce((sum, e) => sum + e.points, 0);
    const lifetimeCoins = entries.filter((e) => e.points > 0).reduce((sum, e) => sum + e.points, 0);

    const reached = TIERS.filter((t) => lifetimeCoins >= t.minLifetimeCoins);
    const current = reached[reached.length - 1];
    const next = TIERS[reached.length];

    return {
      customer,
      signIn: (mobile) => setCustomer({ ...mockCustomer, mobile }),
      signOut: () => {
        setCustomer(null);
        setActiveRedemption(null);
        setAppointments([]);
      },
      coinBalance,
      lifetimeCoins,
      tier: current.tier,
      nextTier: next
        ? {
            tier: next.tier,
            coinsNeeded: next.minLifetimeCoins - lifetimeCoins,
            progress:
              (lifetimeCoins - current.minLifetimeCoins) /
              (next.minLifetimeCoins - current.minLifetimeCoins),
          }
        : null,
      coinEntries: entries,
      activeRedemption,
      redeemCoins: (coins) => {
        const redemption = {
          code: makeRedemptionCode(),
          coins,
          expiresAt: Date.now() + REDEMPTION_VALID_MS,
        };
        setActiveRedemption(redemption);
        setEntries((prev) => [
          {
            id: `LPE-R-${redemption.code}`,
            source: 'redeemed',
            points: -coins,
            date: today(),
            title: `Redemption code ${redemption.code}`,
          },
          ...prev,
        ]);
        return redemption;
      },
      // Coins are held while a code is live; an expired, unused code returns them.
      clearRedemption: () => {
        if (activeRedemption && activeRedemption.expiresAt <= Date.now()) {
          const heldId = `LPE-R-${activeRedemption.code}`;
          setEntries((prev) => prev.filter((e) => e.id !== heldId));
        }
        setActiveRedemption(null);
      },
      appointments,
      bookAppointment: (input) => {
        const appointment = { ...input, id: `APT-${Date.now().toString(36).toUpperCase()}` };
        setAppointments((prev) =>
          [...prev, appointment].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)),
        );
        return appointment;
      },
      cancelAppointment: (id) => setAppointments((prev) => prev.filter((a) => a.id !== id)),
    };
  }, [customer, entries, activeRedemption, appointments]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}

// Signed-in screens can render once more during sign-out before the router
// moves away, so fall back to the sample customer instead of crashing.
export function useCustomer() {
  const { customer } = useAppState();
  return customer ?? mockCustomer;
}

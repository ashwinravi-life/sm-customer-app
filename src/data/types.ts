// Shapes loosely follow the ERPNext doctypes they will come from later
// (Customer, Sales Order, Loyalty Point Entry, Coupon Code, etc.).

export type Tier = 'Silver' | 'Gold' | 'Platinum';

export interface Customer {
  customerId: string;
  name: string;
  firstName: string;
  mobile: string;
  email?: string;
  memberSince: string;
  referralCode: string;
}

export type CoinSource =
  | 'purchase'
  | 'walk_in'
  | 'eye_test'
  | 'referral_join'
  | 'referral_purchase'
  | 'redeemed';

export interface CoinEntry {
  id: string;
  source: CoinSource;
  points: number;
  date: string;
  title: string;
  reference?: string;
}

export type OrderStage = 'confirmed' | 'lab' | 'qc' | 'ready' | 'delivered';

export interface OrderItem {
  itemGroup: 'Frame' | 'Lens' | 'Sunglasses' | 'Contact Lens' | 'Service';
  itemName: string;
  itemCode: string;
  description?: string;
  qty: number;
  amount: number;
}

export interface Order {
  id: string;
  date: string;
  store: string;
  forName: string;
  fulfilment: 'store_pickup' | 'home_delivery';
  stage: OrderStage;
  stageDates: Partial<Record<OrderStage, string>>;
  expectedDate: string;
  items: OrderItem[];
  total: number;
  coinsEarned: number;
  coinsRedeemed: number;
  advancePaid: number;
  balancePaid: number;
  // Raised when the order is delivered or picked up.
  invoiceNo?: string;
  invoiceDate?: string;
}

export interface RxEye {
  sph: string;
  cyl: string;
  axis: string;
  add: string;
  va: string;
}

export interface Prescription {
  id: string;
  date: string;
  type: 'Spectacle' | 'Contact Lens';
  store: string;
  optometrist: string;
  right: RxEye;
  left: RxEye;
  pd: string;
  nextExamDue: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: 'Self' | 'Spouse' | 'Son' | 'Daughter' | 'Father' | 'Mother' | 'Sister' | 'Brother';
  age: number;
  avatarColor: string;
  prescriptions: Prescription[];
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'Frames' | 'Lenses' | 'Sunglasses' | 'Eye Test' | 'Contact Lens';
  validTill: string;
  minOrder?: number;
  accent: 'teal' | 'coral' | 'purple' | 'sky' | 'coin';
  // Headline shown big on the coupon, e.g. "40%" + "OFF".
  value: string;
  valueLabel: string;
  terms: string[];
  image?: string;
  // Only for SM Club members of this tier and above.
  exclusiveTier?: 'Gold' | 'Platinum';
}

export type StoreService = 'Eye test' | 'Contact lens' | 'Repairs' | 'Kids corner';

export interface Store {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  // Same every day, in 24h "HH:MM" form.
  opensAt: string;
  closesAt: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  services: StoreService[];
  photos: string[];
}

export interface Referral {
  id: string;
  name: string;
  joinedOn: string;
  status: 'joined' | 'purchased';
}

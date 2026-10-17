import type {
  CoinEntry,
  Customer,
  FamilyMember,
  Offer,
  Order,
  Referral,
  Store,
  Tier,
} from './types';

// Prototype sample data. Replaced by ERPNext API calls later.

export const COIN_VALUE_RUPEES = 1;

export const EARN_RULES = {
  purchasePercent: 5,
  walkIn: 10,
  eyeTest: 50,
  referralJoin: 100,
  referralPurchase: 250,
} as const;

export const TIERS: { tier: Tier; minLifetimeCoins: number }[] = [
  { tier: 'Silver', minLifetimeCoins: 0 },
  { tier: 'Gold', minLifetimeCoins: 1000 },
  { tier: 'Platinum', minLifetimeCoins: 3000 },
];

export const customer: Customer = {
  customerId: 'SM-CUST-104417',
  name: 'Ashwin Ravi',
  firstName: 'Ashwin',
  mobile: '9894541371',
  memberSince: '2023-03-14',
  referralCode: 'ASHWIN417',
};

export const coinEntries: CoinEntry[] = [
  { id: 'LPE-0012', source: 'purchase', points: 902, date: '2026-10-09', title: 'Order purchase', reference: 'T041-27OB-0853' },
  { id: 'LPE-0011', source: 'referral_purchase', points: 250, date: '2026-10-02', title: 'Karthik made his first purchase' },
  { id: 'LPE-0010', source: 'eye_test', points: 50, date: '2026-09-23', title: 'Eye test at T131 Trichy' },
  { id: 'LPE-0009', source: 'walk_in', points: 10, date: '2026-09-23', title: 'Store visit at T131 Trichy' },
  { id: 'LPE-0008', source: 'redeemed', points: -500, date: '2026-08-30', title: 'Redeemed at billing', reference: 'T013-27OB-0042' },
  { id: 'LPE-0007', source: 'referral_join', points: 100, date: '2026-08-18', title: 'Karthik joined with your code' },
  { id: 'LPE-0006', source: 'referral_join', points: 100, date: '2026-08-11', title: 'Divya joined with your code' },
  { id: 'LPE-0005', source: 'purchase', points: 524, date: '2026-06-28', title: 'Order purchase', reference: 'T013-27OB-0042' },
  { id: 'LPE-0004', source: 'eye_test', points: 50, date: '2026-06-28', title: 'Eye test at T013 Chennai' },
  { id: 'LPE-0003', source: 'walk_in', points: 10, date: '2026-06-28', title: 'Store visit at T013 Chennai' },
  { id: 'LPE-0002', source: 'walk_in', points: 10, date: '2026-04-12', title: 'Store visit at TS039 Hyderabad' },
  { id: 'LPE-0001', source: 'purchase', points: 184, date: '2023-03-14', title: 'Welcome bonus + first purchase' },
];

export const orders: Order[] = [
  {
    id: 'T041-27OB-0853',
    date: '2026-10-09',
    store: 'T041 Anna Nagar, Chennai',
    forName: 'Ashwin Ravi',
    fulfilment: 'store_pickup',
    stage: 'qc',
    stageDates: { confirmed: '2026-10-09', lab: '2026-10-10', qc: '2026-10-14' },
    expectedDate: '2026-10-19',
    items: [
      { itemGroup: 'Frame', itemName: 'Specsmakers XJ2270', itemCode: 'FMHBKMBR52SMO2270', description: 'Matte Brown · 52-18-140', qty: 1, amount: 2590 },
      { itemGroup: 'Lens', itemName: 'EVA 1.6 Digital BluPro', itemCode: 'PAL2BLUPROFP3', description: 'Progressive · Blue light filter', qty: 1, amount: 10490 },
      { itemGroup: 'Service', itemName: 'Specs Assist Plus', itemCode: 'SVC-SAP', description: '1-year warranty cover', qty: 1, amount: 4950 },
    ],
    total: 18030,
    coinsEarned: 902,
    coinsRedeemed: 0,
  },
  {
    id: 'T013-27OB-0042',
    date: '2026-06-28',
    store: 'T013 K.K. Nagar, Chennai',
    forName: 'Priya Ashwin',
    fulfilment: 'home_delivery',
    stage: 'delivered',
    stageDates: { confirmed: '2026-06-28', lab: '2026-06-29', qc: '2026-07-02', ready: '2026-07-03', delivered: '2026-07-04' },
    expectedDate: '2026-07-04',
    items: [
      { itemGroup: 'Frame', itemName: 'Specsmakers XJ2261', itemCode: 'FMHBKMTO52SMO2261', description: 'Tortoise · 52-17-140', qty: 1, amount: 2590 },
      { itemGroup: 'Lens', itemName: 'Hoya 1.6 BlueControl', itemCode: 'SV16BLUCTRL', description: 'Single vision', qty: 1, amount: 7890 },
    ],
    total: 9980,
    coinsEarned: 524,
    coinsRedeemed: 500,
  },
  {
    id: 'TS039-26OB-1188',
    date: '2026-04-12',
    store: 'TS039 Suchitra, Hyderabad',
    forName: 'Aarav Ashwin',
    fulfilment: 'store_pickup',
    stage: 'delivered',
    stageDates: { confirmed: '2026-04-12', lab: '2026-04-13', qc: '2026-04-15', ready: '2026-04-16', delivered: '2026-04-17' },
    expectedDate: '2026-04-16',
    items: [
      { itemGroup: 'Frame', itemName: 'Specsmakers Kids Flexi K12', itemCode: 'FMKDFLXBL46K12', description: 'Flexible · Blue', qty: 1, amount: 1490 },
      { itemGroup: 'Lens', itemName: 'Polycarbonate Kids Shield', itemCode: 'SVPCKIDS', description: 'Impact resistant', qty: 1, amount: 2990 },
    ],
    total: 4480,
    coinsEarned: 224,
    coinsRedeemed: 0,
  },
];

export const family: FamilyMember[] = [
  {
    id: 'self',
    name: 'Ashwin Ravi',
    relation: 'Self',
    age: 33,
    avatarColor: '#37D7BD',
    prescriptions: [
      {
        id: 'RX-51cb95a7a0',
        date: '2026-09-23',
        type: 'Spectacle',
        store: 'T131 Thillai Nagar, Trichy',
        optometrist: 'Dr. Harish',
        right: { sph: '-6.75', cyl: '-7.00', axis: '16', add: '+2.00', va: '6/6' },
        left: { sph: '-8.00', cyl: '-5.75', axis: '27', add: '+2.00', va: '6/6' },
        pd: '62',
        nextExamDue: '2027-09-23',
      },
      {
        id: 'RX-b7538d7ea6',
        date: '2025-08-02',
        type: 'Spectacle',
        store: 'T013 K.K. Nagar, Chennai',
        optometrist: 'Dr. Meena',
        right: { sph: '-6.50', cyl: '-6.75', axis: '15', add: '+1.75', va: '6/6' },
        left: { sph: '-7.75', cyl: '-5.50', axis: '25', add: '+1.75', va: '6/9' },
        pd: '62',
        nextExamDue: '2026-08-02',
      },
    ],
  },
  {
    id: 'spouse',
    name: 'Priya Ashwin',
    relation: 'Spouse',
    age: 31,
    avatarColor: '#F2765A',
    prescriptions: [
      {
        id: 'RX-3f20c11d9e',
        date: '2026-06-28',
        type: 'Spectacle',
        store: 'T013 K.K. Nagar, Chennai',
        optometrist: 'Dr. Meena',
        right: { sph: '-2.25', cyl: '-0.50', axis: '180', add: '-', va: '6/6' },
        left: { sph: '-2.00', cyl: '-0.75', axis: '170', add: '-', va: '6/6' },
        pd: '60',
        nextExamDue: '2027-06-28',
      },
    ],
  },
  {
    id: 'son',
    name: 'Aarav Ashwin',
    relation: 'Son',
    age: 9,
    avatarColor: '#6D7BE0',
    prescriptions: [
      {
        id: 'RX-9a1e77c402',
        date: '2026-04-12',
        type: 'Spectacle',
        store: 'TS039 Suchitra, Hyderabad',
        optometrist: 'Dr. Harish',
        right: { sph: '-1.25', cyl: '-', axis: '-', add: '-', va: '6/6' },
        left: { sph: '-1.00', cyl: '-0.25', axis: '90', add: '-', va: '6/6' },
        pd: '54',
        nextExamDue: '2026-10-12',
      },
    ],
  },
];

export const offers: Offer[] = [
  {
    id: 'OFF-01',
    code: 'BLUPRO40',
    title: '40% off BluPro lenses',
    description: 'Block blue light from screens. Valid on all BluPro single vision and progressive lenses.',
    category: 'Lenses',
    validTill: '2026-10-31',
    minOrder: 3000,
    accent: 'teal',
  },
  {
    id: 'OFF-02',
    code: 'FRAME2',
    title: 'Buy 1 frame, get 1 free',
    description: 'Pick any two frames from the Specsmakers house collection. The lower-priced one is free.',
    category: 'Frames',
    validTill: '2026-11-15',
    accent: 'coral',
  },
  {
    id: 'OFF-03',
    code: 'SUNNY25',
    title: 'Flat 25% off sunglasses',
    description: 'Polarised and UV400 sunglasses for the whole family.',
    category: 'Sunglasses',
    validTill: '2026-11-30',
    minOrder: 1500,
    accent: 'coin',
  },
  {
    id: 'OFF-04',
    code: 'EYECHECK',
    title: 'Free eye test + 50 SM Coins',
    description: 'Walk in for a free computerised eye test at any store and earn 50 coins.',
    category: 'Eye Test',
    validTill: '2026-12-31',
    accent: 'purple',
  },
  {
    id: 'OFF-05',
    code: 'CLEAR15',
    title: '15% off contact lenses',
    description: 'On monthly and daily disposables from top brands.',
    category: 'Contact Lens',
    validTill: '2026-11-10',
    minOrder: 2000,
    accent: 'sky',
  },
];

export const stores: Store[] = [
  {
    id: 'T041',
    code: 'T041',
    name: 'Specsmakers Anna Nagar',
    address: '2nd Avenue, Anna Nagar',
    city: 'Chennai',
    phone: '8098101041',
    hours: '10:00 AM – 9:30 PM',
    distanceKm: 1.2,
    latitude: 13.085,
    longitude: 80.2101,
    services: ['Eye test', 'Contact lens', 'Repairs'],
  },
  {
    id: 'T013',
    code: 'T013',
    name: 'Specsmakers K.K. Nagar',
    address: 'No. 33 & 887 Grace Enclave, Munusamy Salai, K.K. Nagar',
    city: 'Chennai',
    phone: '8098101001',
    hours: '10:00 AM – 9:30 PM',
    distanceKm: 3.8,
    latitude: 13.0405,
    longitude: 80.1994,
    services: ['Eye test', 'Kids corner', 'Repairs'],
  },
  {
    id: 'T027',
    code: 'T027',
    name: 'Specsmakers Velachery',
    address: '100 Feet Road, Velachery',
    city: 'Chennai',
    phone: '8098101027',
    hours: '10:00 AM – 10:00 PM',
    distanceKm: 7.4,
    latitude: 12.9791,
    longitude: 80.2209,
    services: ['Eye test', 'Contact lens'],
  },
  {
    id: 'T131',
    code: 'T131',
    name: 'Specsmakers Thillai Nagar',
    address: 'No. 10 A, 11th Cross, Thillai Nagar Main Road',
    city: 'Trichy',
    phone: '8098110980',
    hours: '10:00 AM – 9:00 PM',
    distanceKm: 318,
    latitude: 10.8281,
    longitude: 78.6863,
    services: ['Eye test', 'Repairs'],
  },
];

export const referrals: Referral[] = [
  { id: 'REF-1', name: 'Karthik S', joinedOn: '2026-08-18', status: 'purchased' },
  { id: 'REF-2', name: 'Divya R', joinedOn: '2026-08-11', status: 'joined' },
];

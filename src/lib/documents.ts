import { File, Paths } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { stores } from '@/data/mock';
import type { Customer, Order, OrderItem } from '@/data/types';
import { LOGO_PNG_BASE64 } from '@/lib/logo-base64';

// Order receipt and tax invoice PDFs, styled after the specse order receipt
// print format. Prototype data, so every page carries a SAMPLE watermark.

const COMPANY = 'Specsmakers Opticians Private Limited';
const GSTIN = '33AAPCS6371Q1ZH';

const TAX: Record<OrderItem['itemGroup'], { hsn: string; rate: number }> = {
  Frame: { hsn: '90031900', rate: 5 },
  Lens: { hsn: '90015000', rate: 5 },
  'Contact Lens': { hsn: '90013000', rate: 5 },
  Sunglasses: { hsn: '90041000', rate: 18 },
  Service: { hsn: '998729', rate: 18 },
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const money = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function ddmmyyyy(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function storeFor(order: Order) {
  const code = order.id.split('-')[0];
  const store = stores.find((s) => s.code === code);
  const state = /Hyderabad/i.test(order.store) ? 'Telangana' : 'Tamil Nadu';
  return {
    name: order.store,
    address: store ? `${store.address}, ${store.city}` : order.store,
    phone: store?.phone,
    state,
  };
}

// Item amounts are GST-inclusive; split each into taxable value + CGST + SGST.
function lines(order: Order) {
  return order.items.map((item, i) => {
    const { hsn, rate } = TAX[item.itemGroup];
    const taxable = item.amount / (1 + rate / 100);
    const halfTax = (item.amount - taxable) / 2;
    return { n: i + 1, item, hsn, rate, taxable, cgst: halfTax, sgst: halfTax };
  });
}

function gstBreakup(rows: ReturnType<typeof lines>) {
  const byRate = new Map<number, number>();
  for (const r of rows) byRate.set(r.rate, (byRate.get(r.rate) ?? 0) + r.cgst);
  return [...byRate.entries()]
    .sort(([a], [b]) => a - b)
    .map(([rate, half]) => `CGST ${rate / 2}%: ${money(half)}, SGST ${rate / 2}%: ${money(half)}`)
    .join(' · ');
}

const CSS = `
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @page { size: A4; margin: 14mm 12mm; }
  body { font-family: Arial, Helvetica, sans-serif; color: #000; font-size: 11px; line-height: 1.4; margin: 0; }
  .watermark { position: fixed; top: 40%; left: 0; right: 0; text-align: center; font-size: 96px; font-weight: 700;
    color: rgba(0,0,0,0.05); transform: rotate(-24deg); letter-spacing: 12px; z-index: 0; }
  .top { display: flex; justify-content: space-between; align-items: center; }
  .logo { height: 24px; }
  .doc-title { font-size: 16px; font-weight: 700; letter-spacing: 1px; }
  .brand { margin-top: 10px; font-weight: 700; font-size: 12px; }
  .muted { color: #444; }
  .box { border: 1px solid #000; margin-top: 12px; }
  .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; padding: 10px 12px; border-bottom: 1px solid #000; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 10px; padding: 6px 8px; border-bottom: 1px solid #000; }
  td { padding: 6px 8px; vertical-align: top; font-size: 10.5px; }
  td.num, th.num { text-align: right; white-space: nowrap; }
  .cat { font-weight: 700; }
  .summary { display: flex; justify-content: space-between; gap: 24px; margin-top: 12px; }
  .gst { flex: 1; }
  .totals { min-width: 220px; }
  .totals div { display: flex; justify-content: space-between; gap: 16px; padding: 2px 0; }
  .grand { font-weight: 700; font-size: 12.5px; border-top: 1px solid #000; margin-top: 4px; padding-top: 6px !important; }
  .payment { border: 1px solid #999; padding: 8px 12px; margin-top: 14px; width: 300px; }
  .payment div { padding: 2px 0; }
  .tnc { margin-top: 18px; font-size: 10px; }
  .tnc h4 { margin: 0 0 6px; font-size: 11px; }
  .tnc ul { margin: 0; padding-left: 16px; }
  .footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #d1d5db; font-size: 10px; display: flex; justify-content: space-between; gap: 16px; }
  .sample { margin-top: 10px; font-size: 9.5px; color: #b91c1c; text-align: center; }
`;

function shell(title: string, body: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8" /><style>${CSS}</style></head><body>
    <div class="watermark">SAMPLE</div>
    <div class="top">
      <img class="logo" src="data:image/png;base64,${LOGO_PNG_BASE64}" />
      <div class="doc-title">${esc(title)}</div>
    </div>
    <div class="brand">${COMPANY}</div>
    <div class="muted">GSTIN: ${GSTIN}</div>
    ${body}
    <div class="footer">
      <div><b>Customer Care:</b> care@specsmakers.in | +91 97915 97915<br /><b>Website:</b> www.specsmakers.in</div>
      <div style="text-align:right">This document is computer generated and does not require signature</div>
    </div>
    <div class="sample">Prototype sample generated by the Specsmakers app. Not a valid tax document.</div>
  </body></html>`;
}

function itemsTable(order: Order) {
  const rows = lines(order);
  const body = rows
    .map(
      (r) => `<tr>
        <td>${r.n}</td>
        <td><span class="cat">${esc(r.item.itemGroup)}</span><br />${esc(r.item.itemName)}${
          r.item.description ? `<br /><span class="muted">${esc(r.item.description)}</span>` : ''
        }</td>
        <td>${r.hsn}</td>
        <td class="num">${r.item.qty.toFixed(2)}</td>
        <td class="num">${money(r.taxable)}</td>
        <td class="num">${r.rate.toFixed(2)}%</td>
        <td class="num">${money(r.cgst)}</td>
        <td class="num">${money(r.sgst)}</td>
        <td class="num">${money(r.item.amount)}</td>
      </tr>`,
    )
    .join('');
  return {
    rows,
    html: `<table>
      <thead><tr>
        <th>S#</th><th>Item</th><th>HSN</th><th class="num">Qty</th><th class="num">Taxable</th>
        <th class="num">GST%</th><th class="num">CGST</th><th class="num">SGST</th><th class="num">Amount</th>
      </tr></thead>
      <tbody>${body}</tbody>
    </table>`,
  };
}

function totals(order: Order) {
  const itemTotal = order.items.reduce((s, i) => s + i.amount, 0);
  return `<div class="totals">
    <div><span>Item total</span><span>${money(itemTotal)}</span></div>
    ${order.coinsRedeemed ? `<div><span>SM Coins redeemed</span><span>− ${money(order.coinsRedeemed)}</span></div>` : ''}
    <div class="grand"><span>Grand total (₹)</span><span>${money(order.total)}</span></div>
  </div>`;
}

const TERMS = `<div class="tnc">
  <h4>For terms and conditions, warranty and privacy policy, visit www.specsmakers.in</h4>
  <ul>
    <li>Orders once placed cannot be altered, changed or cancelled.</li>
    <li>Orders must be collected within sixty days of the order date, failing which the order stands cancelled and the advance is forfeited.</li>
    <li>Prices are inclusive of applicable taxes unless otherwise stated.</li>
    <li>Manufacturing defect warranty: One year from the date of purchase only with Specs-Assist; without Specs-Assist, 90 days on frames only.</li>
    <li>All disputes are subject to Chennai jurisdiction only.</li>
  </ul>
</div>`;

export function receiptHtml(order: Order, customer: Customer) {
  const store = storeFor(order);
  const table = itemsTable(order);
  const balanceDue = order.total - order.advancePaid - order.balancePaid;
  return shell(
    'ORDER RECEIPT',
    `<div class="box">
      <div class="meta">
        <div><b>Order No:</b> ${esc(order.id)}</div>
        <div><b>Customer:</b> ${esc(order.forName)}</div>
        <div><b>Order Date:</b> ${ddmmyyyy(order.date)}</div>
        <div><b>Contact:</b> ${esc(customer.mobile)}</div>
        <div><b>Store:</b> ${esc(store.name)}</div>
        <div><b>State:</b> ${store.state}</div>
      </div>
      ${table.html}
    </div>
    <div class="summary">
      <div class="gst"><b>GST break-up:</b> ${gstBreakup(table.rows)}</div>
      ${totals(order)}
    </div>
    <div class="payment">
      <div><b>Advance received:</b> ₹ ${money(order.advancePaid)}</div>
      <div><b>Balance received:</b> ₹ ${money(order.balancePaid)}</div>
      <div><b>SM Coins used:</b> ₹ ${money(order.coinsRedeemed)}</div>
      <div><b>Balance due:</b> ₹ ${money(Math.max(0, balanceDue))}</div>
    </div>
    ${TERMS}`,
  );
}

export function invoiceHtml(order: Order, customer: Customer) {
  if (!order.invoiceNo || !order.invoiceDate) throw new Error('Invoice not raised for this order yet');
  const store = storeFor(order);
  const table = itemsTable(order);
  return shell(
    'TAX INVOICE',
    `<div class="box">
      <div class="meta">
        <div><b>Invoice No:</b> ${esc(order.invoiceNo)}</div>
        <div><b>Invoice Date:</b> ${ddmmyyyy(order.invoiceDate)}</div>
        <div><b>Order No:</b> ${esc(order.id)}</div>
        <div><b>Order Date:</b> ${ddmmyyyy(order.date)}</div>
        <div><b>Billed to:</b> ${esc(order.forName)} · ${esc(customer.mobile)}</div>
        <div><b>Place of supply:</b> ${store.state}</div>
        <div><b>Sold by:</b> ${esc(store.name)}</div>
        <div>${esc(store.address)}</div>
      </div>
      ${table.html}
    </div>
    <div class="summary">
      <div class="gst"><b>GST break-up:</b> ${gstBreakup(table.rows)}</div>
      ${totals(order)}
    </div>
    <div class="payment">
      <div><b>Amount paid:</b> ₹ ${money(order.advancePaid + order.balancePaid)}</div>
      <div><b>SM Coins used:</b> ₹ ${money(order.coinsRedeemed)}</div>
      <div><b>SM Coins earned:</b> ${order.coinsEarned}</div>
    </div>
    ${TERMS}`,
  );
}

// A4 at 72 dpi.
const A4 = { width: 595, height: 842 };

// Renders the PDF, gives it a readable file name, then opens the share sheet
// (Save to Files / Drive, WhatsApp, email…).
export async function sharePdf(html: string, fileName: string) {
  const { uri } = await Print.printToFileAsync({ html, ...A4 });
  const target = new File(Paths.cache, fileName);
  if (target.exists) target.delete();
  await new File(uri).move(target);
  await Sharing.shareAsync(target.uri, {
    mimeType: 'application/pdf',
    UTI: 'com.adobe.pdf',
    dialogTitle: fileName,
  });
}

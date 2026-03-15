// ─── Demo business rules (Luxembourg-inspired, simplified for quote simulation) ───
// kWp from roof area: ~0.17 kWp/m² (typical panels), 1 decimal
// Production: ~1150 kWh/kWp/year (Luxembourg)
// Klimabonus 2026 (simplifié): maximum €10,000 à 15 kWc; au-dessus 15 kWc: +€667/kWp; batterie +€2,250 (max 9 kWh)
// Préfinancement direct depuis le 4 janvier 2026: déduit de la facture installateur
// TVA réduite 3% sur toutes les installations PV (depuis 01/01/2023)
// Install: Basic €2,100/kWp, Premium €2,400/kWp. Battery add-on ~€6,500 (demo)
// Savings: % of annual bill (low 35%, normal 45%, high 55%)
// Quote range: show "from X to Y €" so the company is not bound to a single price (~12% band)

const AREA_TO_KWP_FACTOR = 0.17;
const PRODUCTION_KWH_PER_KWP = 1150;
const KLIMABONUS_BASE_EUR = 10000; // 2026: max €10,000 à 15 kWc (was €9,300 in 2024)
const KLIMABONUS_KWP_THRESHOLD = 15;
const KLIMABONUS_EUR_PER_KWP_ABOVE = 667; // 2026: €667/kWp above 15 kWc (was €620)
const KLIMABONUS_BATTERY_EUR = 2250; // max at 9 kWh battery capacity
const RATE_BASIC_EUR_PER_KWP = 2100;
const RATE_PREMIUM_EUR_PER_KWP = 2400;
const SAVINGS_MULTIPLIERS = { low: 0.35, normal: 0.45, high: 0.55 } as const;

export function calculateKwp(areaM2: number): number {
  return Math.round(areaM2 * AREA_TO_KWP_FACTOR * 10) / 10;
}

export function calculateProduction(kwp: number): number {
  return Math.round(kwp * PRODUCTION_KWH_PER_KWP);
}

export function calculateKlimabonus(kwp: number, hasBattery: boolean): number {
  let bonus = kwp <= KLIMABONUS_KWP_THRESHOLD
    ? KLIMABONUS_BASE_EUR
    : KLIMABONUS_BASE_EUR + (kwp - KLIMABONUS_KWP_THRESHOLD) * KLIMABONUS_EUR_PER_KWP_ABOVE;
  if (hasBattery) bonus += KLIMABONUS_BATTERY_EUR;
  return Math.round(bonus);
}

export function calculateCost(kwp: number, packageType: 'basic' | 'premium'): number {
  const rate = packageType === 'basic' ? RATE_BASIC_EUR_PER_KWP : RATE_PREMIUM_EUR_PER_KWP;
  return Math.round(kwp * rate);
}

export function calculateAnnualSavings(monthlyBill: number, profile: 'low' | 'normal' | 'high'): number {
  return Math.round(monthlyBill * 12 * SAVINGS_MULTIPLIERS[profile]);
}

export function calculatePayback(netCost: number, annualSavings: number): number {
  if (annualSavings <= 0 || netCost <= 0) return 0;
  return Math.round((netCost / annualSavings) * 10) / 10;
}

/** Net cost to client (never negative: subsidy cannot exceed install cost in display). */
export function calculateNetCost(installCost: number, klimabonus: number): number {
  return Math.max(0, Math.round(installCost - klimabonus));
}

/** Quote range: from base net cost up to +margin% (company can quote within band, not a fixed price). */
export const QUOTE_RANGE_MARGIN_PERCENT = 0.12; // e.g. 12% = range from X to X×1.12

/** Minimum acceptable margin (company revenue vs install cost). Below this, show a guardrail alert. */
export const MIN_MARGIN_PERCENT = 0.05; // 5%

/** Margin = (price - installCost) / price. Returns undefined if price <= 0. */
export function getMargin(installCost: number, price: number): number | undefined {
  if (price <= 0) return undefined;
  return (price - installCost) / price;
}

/** True when margin at the given price is below MIN_MARGIN_PERCENT (or negative). */
export function isMarginBelowMinimum(installCost: number, price: number): boolean {
  const margin = getMargin(installCost, price);
  if (margin === undefined) return true;
  return margin < MIN_MARGIN_PERCENT;
}

export function calculateNetCostRange(netCost: number): { min: number; max: number; mid: number } {
  const min = Math.round(netCost);
  const max = Math.round(netCost * (1 + QUOTE_RANGE_MARGIN_PERCENT));
  return { min, max, mid: Math.round((min + max) / 2) };
}

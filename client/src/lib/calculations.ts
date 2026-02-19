export function calculateKwp(areaM2: number): number {
  return Math.round(areaM2 * 0.17 * 10) / 10;
}

export function calculateProduction(kwp: number): number {
  return Math.round(kwp * 1150);
}

export function calculateKlimabonus(kwp: number, hasBattery: boolean): number {
  let bonus = 0;
  if (kwp <= 15) {
    bonus = 9300; // Simplified base for typical residential <15kWp, per spec logic
  } else {
    bonus = 9300 + (kwp - 15) * 620;
  }
  
  // Cap bonus logic if needed, but following spec strictly:
  // "if kwp <= 15 => 9300 else => 9300 + (kwp-15)*620"
  
  if (hasBattery) {
    bonus += 2250; // Battery bonus
  }
  
  return Math.round(bonus);
}

export function calculateCost(kwp: number, packageType: 'basic' | 'premium'): number {
  const rate = packageType === 'basic' ? 2100 : 2400;
  return Math.round(kwp * rate);
}

export function calculateAnnualSavings(monthlyBill: number, profile: 'low' | 'normal' | 'high'): number {
  const multipliers = {
    low: 0.35,
    normal: 0.45,
    high: 0.55,
  };
  return Math.round(monthlyBill * 12 * multipliers[profile]);
}

export function calculatePayback(netCost: number, annualSavings: number): number {
  if (annualSavings === 0) return 0;
  return Math.round((netCost / annualSavings) * 10) / 10;
}

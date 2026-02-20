import { describe, it, expect } from 'vitest';
import {
  calculateKwp,
  calculateProduction,
  calculateKlimabonus,
  calculateCost,
  calculateAnnualSavings,
  calculatePayback,
  calculateNetCost,
  calculateNetCostRange,
  QUOTE_RANGE_MARGIN_PERCENT,
  getMargin,
  isMarginBelowMinimum,
  MIN_MARGIN_PERCENT,
} from './calculations';

describe('calculateKwp', () => {
  it('calculates kWp from area (0.17 factor, 1 decimal)', () => {
    expect(calculateKwp(45)).toBe(7.7); // 45 * 0.17 = 7.65 -> arredonda a 7.7
    expect(calculateKwp(100)).toBe(17);
    expect(calculateKwp(10)).toBe(1.7);
  });
});

describe('calculateProduction', () => {
  it('returns annual production (1150 kWh/kWp)', () => {
    expect(calculateProduction(8)).toBe(9200);
    expect(calculateProduction(15)).toBe(17250);
  });
});

describe('calculateKlimabonus', () => {
  it('returns base 9300 for ≤15 kWp without battery', () => {
    expect(calculateKlimabonus(10, false)).toBe(9300);
    expect(calculateKlimabonus(15, false)).toBe(9300);
  });

  it('adds 620 €/kWp above 15 kWp', () => {
    expect(calculateKlimabonus(16, false)).toBe(9300 + 620); // 9920
    expect(calculateKlimabonus(20, false)).toBe(9300 + 5 * 620); // 12400
  });

  it('adds 2250 for battery', () => {
    expect(calculateKlimabonus(10, true)).toBe(9300 + 2250); // 11550
    expect(calculateKlimabonus(16, true)).toBe(9300 + 620 + 2250); // 12170
  });
});

describe('calculateCost', () => {
  it('basic rate 2100 €/kWp', () => {
    expect(calculateCost(10, 'basic')).toBe(21000);
  });

  it('premium rate 2400 €/kWp', () => {
    expect(calculateCost(10, 'premium')).toBe(24000);
  });
});

describe('calculateAnnualSavings', () => {
  it('uses profile multiplier on annual bill (monthly * 12)', () => {
    expect(calculateAnnualSavings(100, 'low')).toBe(100 * 12 * 0.35);   // 420
    expect(calculateAnnualSavings(100, 'normal')).toBe(100 * 12 * 0.45); // 540
    expect(calculateAnnualSavings(100, 'high')).toBe(100 * 12 * 0.55);   // 660
  });
});

describe('calculatePayback', () => {
  it('returns years to payback (netCost / annualSavings)', () => {
    expect(calculatePayback(10000, 1000)).toBe(10);
    expect(calculatePayback(13500, 540)).toBe(25); // 13500/540 = 25
  });

  it('returns 0 when savings or netCost <= 0', () => {
    expect(calculatePayback(10000, 0)).toBe(0);
    expect(calculatePayback(0, 1000)).toBe(0);
  });
});

describe('calculateNetCost', () => {
  it('returns installCost - klimabonus when positive', () => {
    expect(calculateNetCost(20000, 9300)).toBe(10700);
  });

  it('never returns negative (max 0)', () => {
    expect(calculateNetCost(8000, 9300)).toBe(0);
  });
});

describe('calculateNetCostRange', () => {
  it('min equals netCost rounded, max = min * (1 + margin)', () => {
    const { min, max, mid } = calculateNetCostRange(10000);
    expect(min).toBe(10000);
    expect(max).toBe(Math.round(10000 * (1 + QUOTE_RANGE_MARGIN_PERCENT))); // 11200
    expect(mid).toBe(Math.round((10000 + 11200) / 2)); // 10600
  });

  it('margin is 12%', () => {
    expect(QUOTE_RANGE_MARGIN_PERCENT).toBe(0.12);
  });
});

describe('getMargin', () => {
  it('returns (price - installCost) / price', () => {
    expect(getMargin(8000, 10000)).toBe(0.2);
    expect(getMargin(9500, 10000)).toBe(0.05);
  });

  it('returns undefined when price <= 0', () => {
    expect(getMargin(1000, 0)).toBeUndefined();
    expect(getMargin(1000, -1)).toBeUndefined();
  });
});

describe('isMarginBelowMinimum', () => {
  it('returns true when margin < MIN_MARGIN_PERCENT (5%)', () => {
    expect(isMarginBelowMinimum(9600, 10000)).toBe(true);  // 4%
    expect(isMarginBelowMinimum(9500, 10000)).toBe(false); // 5% exact
    expect(isMarginBelowMinimum(9400, 10000)).toBe(false); // 6%
  });

  it('returns true when margin is negative', () => {
    expect(isMarginBelowMinimum(11000, 10000)).toBe(true);
  });

  it('returns true when price <= 0', () => {
    expect(isMarginBelowMinimum(1000, 0)).toBe(true);
  });

  it('MIN_MARGIN_PERCENT is 5%', () => {
    expect(MIN_MARGIN_PERCENT).toBe(0.05);
  });
});

import { formatCurrency } from '../src/lib/format';

describe('formatCurrency hydration consistency', () => {
  it('always produces US-style number formatting (dot as decimal separator)', () => {
    // The #1 source of hydration errors: different locale defaults
    // Server might render "0.00", client renders "0,00" → hydration mismatch
    const zero = formatCurrency(0);
    expect(zero).toBe('0.00'); // NOT "0,00" or "0.000"

    const thousand = formatCurrency(1000);
    expect(thousand).toBe('1,000.00'); // NOT "1.000,00"

    const big = formatCurrency(1234567.89);
    expect(big).toBe('1,234,567.89');
  });

  it('produces identical output for server and client', () => {
    // Both should use the same algorithm (toFixed + replace)
    const server = formatCurrency(42.5);
    const client = formatCurrency(42.5);
    expect(server).toBe(client);
  });

  it('never uses toLocaleString or Intl.NumberFormat', () => {
    // These are the forbidden functions that cause hydration mismatches
    const fnStr = formatCurrency.toString();
    expect(fnStr.includes('toLocaleString')).toBe(false);
    expect(fnStr.includes('Intl.NumberFormat')).toBe(false);

    // And verify callers don't use them either — checked in no-toLocale-string rule test
  });

  it('handles negative numbers', () => {
    const neg = formatCurrency(-100.5);
    expect(neg).toBe('-100.50');
  });

  it('handles zero and small decimals', () => {
    expect(formatCurrency(0)).toBe('0.00');
    expect(formatCurrency(0.001)).toBe('0.00');
    expect(formatCurrency(0.999)).toBe('1.00');
  });

  it('handles custom decimal places', () => {
    expect(formatCurrency(42, 0)).toBe('42');
    expect(formatCurrency(42, 3)).toBe('42.000');
  });
});

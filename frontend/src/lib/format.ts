// Consistent number formatting across server and client (always en-US)
export function formatCurrency(value: unknown, decimals = 2): string {
  const num = typeof value === 'number' ? value : 0;
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

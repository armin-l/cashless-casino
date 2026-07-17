// Consistent number formatting across server and client (always en-US)
export function formatCurrency(value: number, decimals = 2): string {
  return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

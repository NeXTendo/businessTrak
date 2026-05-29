export function formatZMW(amount: number): string {
  return 'K ' + amount.toLocaleString('en-ZM', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
export function formatCurrency(amount: number, symbol: string): string {
  return symbol + ' ' + amount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
export function convertToZMW(amount: number, rateToZmw: number): number {
  return parseFloat((amount * rateToZmw).toFixed(2));
}
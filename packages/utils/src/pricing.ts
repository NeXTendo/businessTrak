export function calculateRentalCost(
  rateAmount: number,
  rateType: 'daily' | 'weekly' | 'monthly',
  startDate: string,
  endDate: string,
  driverRate = 0,
  withDriver = false
): number {
  const diffMs = new Date(endDate).getTime() - new Date(startDate).getTime();
  const divisor = rateType === 'daily' ? 86400000 : rateType === 'weekly' ? 604800000 : 2592000000;
  const units = Math.ceil(diffMs / divisor);
  return parseFloat(((rateAmount + (withDriver ? driverRate : 0)) * units).toFixed(2));
}
export function calculateLateFee(dailyRate: number, endDate: string, returnDate: string, feeRatePct = 10): number {
  const end = new Date(endDate);
  const ret = new Date(returnDate);
  if (ret <= end) return 0;
  const days = Math.ceil((ret.getTime() - end.getTime()) / 86400000);
  return parseFloat((dailyRate * (feeRatePct / 100) * days).toFixed(2));
}
export function calculateInstallmentSchedule(
  total: number,
  downPayment: number,
  count: number,
  startDate: string,
  interval: 'monthly' | 'weekly' = 'monthly'
): Array<{ installmentNo: number; amount: number; dueDate: string }> {
  const perInstall = parseFloat(((total - downPayment) / count).toFixed(2));
  return Array.from({ length: count }, (_, i) => {
    const due = new Date(startDate);
    interval === 'monthly' ? due.setMonth(due.getMonth() + i + 1) : due.setDate(due.getDate() + (i + 1) * 7);
    return { installmentNo: i + 1, amount: perInstall, dueDate: due.toISOString().split('T')[0] };
  });
}
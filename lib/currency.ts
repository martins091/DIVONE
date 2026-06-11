export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function displayNaira(amount: number): string {
  const formatted = amount.toLocaleString('en-NG');
  return `₦${formatted}`;
}

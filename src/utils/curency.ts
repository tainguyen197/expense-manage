export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VI", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

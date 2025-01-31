export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VI", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export function formatVND(amount: number) {
  if (amount <= 0) return "__";

  if (amount >= 1_000_000) {
    return (
      (amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1) + "tr"
    );
  } else if (amount >= 1_000) {
    return (amount / 1_000).toFixed(amount % 1_000 === 0 ? 0 : 1) + "k";
  }
  return amount.toString();
}

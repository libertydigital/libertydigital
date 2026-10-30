/** Internal paid revenue recorded by an administrator, in integer euro cents. */
export const LEAD_PAID_REVENUE_KEY = "_paidRevenueEurCents";

export function getPaidRevenueCents(formData: unknown): number | null {
  if (!formData || typeof formData !== "object" || Array.isArray(formData)) {
    return null;
  }
  const amount = (formData as Record<string, unknown>)[LEAD_PAID_REVENUE_KEY];
  return typeof amount === "number" &&
    Number.isSafeInteger(amount) &&
    amount >= 0
    ? amount
    : null;
}

export function formatEurCents(cents: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function parseEurToCents(raw: string): number | null {
  const value = raw.trim();
  if (!/^(?:0|[1-9]\d{0,5})(?:\.\d{1,2})?$/.test(value)) return null;
  return Math.round(Number(value) * 100);
}

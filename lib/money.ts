export function formatCents(cents: number, currency: string, locale?: string): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(cents / 100);
}

/** Yearly vs monthly, rounded up to the nearest 5% so badges stay catalog-driven. */
export function annualSavingsPercent(yearlyCents: number, monthlyCents: number): number {
  if (monthlyCents <= 0) return 0;
  return Math.max(0, Math.ceil(((monthlyCents * 12 - yearlyCents) * 20) / (monthlyCents * 12)) * 5);
}

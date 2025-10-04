/**
 * Use Intl for stable, locale-aware formatting.
 * Why: consistent currency/number formatting across browsers/locales.
 */
export const formatCurrency = (
  value: number,
  currency = "EUR",
  locale = "es-ES"
) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const formatNumber = (value: number, locale = "es-ES") =>
  new Intl.NumberFormat(locale).format(value);

export const formatDate = (date: string, locale = "es-ES") =>
  new Intl.DateTimeFormat(locale).format(new Date(date));

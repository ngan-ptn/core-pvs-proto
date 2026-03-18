// Date and number formatting always uses de-DE locale regardless of UI language.
// This is intentional per docs/guidelines/copy-guideline.md:
// German date format (DD.MM.YYYY) and 24h time are mandatory in the healthcare context.

const DATE_LOCALE = 'de-DE'

const dateFormatter = new Intl.DateTimeFormat(DATE_LOCALE, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const dateShortFormatter = new Intl.DateTimeFormat(DATE_LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat(DATE_LOCALE, {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const numberFormatter = new Intl.NumberFormat(DATE_LOCALE)

export function formatDate(
  date: Date | number | string,
  style: 'numeric' | 'short' = 'numeric',
): string {
  const d = date instanceof Date ? date : new Date(date)
  return style === 'short'
    ? dateShortFormatter.format(d)
    : dateFormatter.format(d)
}

export function formatTime(date: Date | number | string): string {
  const d = date instanceof Date ? date : new Date(date)
  return timeFormatter.format(d)
}

export function formatNumber(
  n: number,
  options?: Intl.NumberFormatOptions,
): string {
  if (options) {
    return new Intl.NumberFormat(DATE_LOCALE, options).format(n)
  }
  return numberFormatter.format(n)
}

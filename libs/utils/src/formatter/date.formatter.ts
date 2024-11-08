const dateFormatStore: Record<string, Intl.DateTimeFormat> = {};
const numericDateFormatStore: Record<string, Intl.DateTimeFormat> = {};
const relativeDateFormatStore: Record<string, Intl.RelativeTimeFormat> = {};

export function getDateFormatter(locale = '') {
  if (!dateFormatStore[locale]) {
    dateFormatStore[locale] = new Intl.DateTimeFormat(locale || undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      // timeZone: 'UTC',
    });
  }

  return dateFormatStore[locale];
}

export function getNumericDateFormatter(locale = '') {
  if (!numericDateFormatStore[locale]) {
    numericDateFormatStore[locale] = new Intl.DateTimeFormat(
      locale || undefined,
      {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        // timeZone: 'UTC',
      }
    );
  }

  return numericDateFormatStore[locale];
}

export function getRelativeDateFormatter(locale = '') {
  if (!relativeDateFormatStore[locale]) {
    relativeDateFormatStore[locale] = new Intl.RelativeTimeFormat(
      locale || undefined,
      {
        numeric: 'auto',
        style: 'short',
      }
    );
  }

  return relativeDateFormatStore[locale];
}

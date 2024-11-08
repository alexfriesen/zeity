const timeFormatStore: Record<string, Intl.DateTimeFormat> = {};

export function getTimeFormatter(locale = '') {
  if (!timeFormatStore[locale]) {
    timeFormatStore[locale] = new Intl.DateTimeFormat(locale || undefined, {
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit',
      hourCycle: 'h23',
      // timeZone: 'UTC',
    });
  }

  return timeFormatStore[locale];
}

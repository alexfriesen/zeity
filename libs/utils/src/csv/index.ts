export function toCSVBlob(csv: string) {
  return new Blob([csv], { type: 'text/csv' });
}

export function generateCSV<T = Record<string, unknown>>(
  keys: (keyof T)[],
  data: T[],
  separator = ';',
): string {
  const csv = [keys.join(separator)];

  for (const item of data) {
    const values = keys.map((key) => {
      const value = item[key];

      switch (key) {
        case 'tags':
        case 'notes':
          return generateCsvString(value);
        default:
          return value;
      }
    });
    csv.push(values.join(separator));
  }

  return csv.join('\n');
}

function generateCsvString(value: unknown) {
  if (value === null || value === undefined) {
    return '';
  }

  return `"${sanitizeCSVString(value)}"`;
}

export function sanitizeCSVString(text: unknown) {
  if (typeof text === 'number') {
    return String(text);
  }

  if (typeof text === 'function') {
    return '';
  }

  if (text) {
    return String(text)
      .replace(/(\r\n|\n|\r|\s+|\t|&nbsp;)/gm, ' ')
      .replace(/"/g, '""')
      .replace(/ +(?= )/g, '');
  }
  return '';
}

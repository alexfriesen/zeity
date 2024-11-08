export function padLeft(value: number, length = 2, fill = '') {
  return value.toString(10).padStart(length, fill);
}

export const capitalized = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

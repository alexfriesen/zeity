export function omit<T>(object: T, ...keys: (keyof T)[]) {
  for (const key of keys) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [key]: _, ...rest } = object;
    object = rest as T;
  }
  return object;
}

export function pick<T>(object: T, keys: (keyof T)[]) {
  const result = {} as T;
  for (const key of keys) {
    result[key] = object[key];
  }
  return result;
}

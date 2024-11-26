import { describe, expect, it } from 'vitest';
import { omit, pick } from './index';

describe('ObjectUtils', () => {
  describe('subtract', () => {
    it('should omit a property', () => {
      const original = { a: 1, b: 2, c: 3 };
      const omitted = omit(original, 'a');
      expect(Object.keys(original)).toEqual(['a', 'b', 'c']);
      expect(Object.keys(omitted)).toEqual(['b', 'c']);
      expect(omitted).toStrictEqual({ b: 2, c: 3 });
    });
  });

  describe('pick', () => {
    it('should pick a property', () => {
      const original = { a: 1, b: 2, c: 3 };
      const picked = pick(original, ['a']);
      expect(Object.keys(original)).toEqual(['a', 'b', 'c']);
      expect(Object.keys(picked)).toEqual(['a']);
      expect(picked).toStrictEqual({ a: 1 });
    });
  });
});

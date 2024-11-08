import { describe, expect, it } from 'vitest';
import { padLeft } from './index';

describe('StringUtils', () => {
  describe('padLeft', () => {
    it('should fill spaces', () => {
      const value = padLeft(1, 4, '0');
      expect(value).toBe('0001');
    });

    it('should not overflow', () => {
      const value = padLeft(10000, 2, '0');
      expect(value).toBe('10000');
    });
  });
});

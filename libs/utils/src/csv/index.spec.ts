import { describe, expect, it } from 'vitest';

import { generateCSV, sanitizeCSVString } from './index';

describe('generateCSV', () => {
  it('should generate a CSV string', () => {
    expect(
      generateCSV(
        ['id', 'notes', 'start', 'end', 'tags'],
        [
          {
            id: '1',
            notes: 'test',
            start: new Date('2024-10-02T17:01:53.862Z').toISOString(),
            end: new Date('2024-10-02T17:01:53.862Z').toISOString(),
            tags: ['tag1', 'tag2'],
          },
        ],
      ),
    ).toBe(
      'id;notes;start;end;tags\n1;"test";2024-10-02T17:01:53.862Z;2024-10-02T17:01:53.862Z;"tag1,tag2"',
    );
  });
});

describe('sanitizeCSVString', () => {
  it('should sanitize a CSV string', () => {
    expect(sanitizeCSVString('test')).toBe('test');
    expect(sanitizeCSVString('test\n')).toBe('test ');
    expect(sanitizeCSVString('test\r')).toBe('test ');
    expect(sanitizeCSVString('test\r\n')).toBe('test ');
    expect(sanitizeCSVString('test\t')).toBe('test ');
    expect(sanitizeCSVString('test  ')).toBe('test ');
    expect(sanitizeCSVString('test  test')).toBe('test test');
    expect(sanitizeCSVString('test  test  ')).toBe('test test ');

    expect(sanitizeCSVString('test"')).toBe('test""');
    expect(sanitizeCSVString('test"test')).toBe('test""test');
    expect(sanitizeCSVString('test"test"')).toBe('test""test""');

    expect(sanitizeCSVString(null)).toBe('');
    expect(sanitizeCSVString(undefined)).toBe('');

    expect(sanitizeCSVString(0)).toBe('0');
    expect(sanitizeCSVString(1)).toBe('1');
    expect(sanitizeCSVString(1.1)).toBe('1.1');

    expect(sanitizeCSVString([])).toBe('');
    expect(sanitizeCSVString(['test'])).toBe('test');
    expect(sanitizeCSVString(['test', 'test'])).toBe('test,test');

    expect(
      sanitizeCSVString(function () {
        return 'test';
      }),
    ).toBe('');
  });
});

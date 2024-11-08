import { describe, expect, it } from 'vitest';
import {
  calculateDiffSum,
  formatDate,
  formatNumericDate,
  roundToSeconds,
  sortDatesAscending,
  sortDatesDescending,
  timeDiff,
} from './index';

describe('DateUtils', function () {
  describe('roundToSeconds', function () {
    describe('roundToSeconds - roundingMethod: round', function () {
      it('should round down', function () {
        expect(
          roundToSeconds('2023-04-14T10:00:00.499Z', {
            roundingMethod: 'round',
          }).toISOString()
        ).toEqual('2023-04-14T10:00:00.000Z');
      });

      it('should round up', function () {
        expect(
          roundToSeconds('2023-04-14T10:00:00.500Z', {
            roundingMethod: 'round',
          }).toISOString()
        ).toEqual('2023-04-14T10:00:01.000Z');
      });

      it('should round up to miute', function () {
        expect(
          roundToSeconds('2023-04-14T10:00:59.500Z', {
            roundingMethod: 'round',
          }).toISOString()
        ).toEqual('2023-04-14T10:01:00.000Z');
      });
    });

    describe('roundToSeconds - roundingMethod: floor', function () {
      it('should always round down', function () {
        expect(
          roundToSeconds('2023-04-14T10:00:00.499Z', {
            roundingMethod: 'floor',
          }).toISOString()
        ).toEqual('2023-04-14T10:00:00.000Z');

        expect(
          roundToSeconds('2023-04-14T10:00:00.999Z', {
            roundingMethod: 'floor',
          }).toISOString()
        ).toEqual('2023-04-14T10:00:00.000Z');
      });
    });

    describe('roundToSeconds - roundingMethod: ceil', function () {
      it('should always round up', function () {
        expect(
          roundToSeconds('2023-04-14T10:00:00.499Z', {
            roundingMethod: 'ceil',
          }).toISOString()
        ).toEqual('2023-04-14T10:00:01.000Z');

        expect(
          roundToSeconds('2023-04-14T10:00:00.001Z', {
            roundingMethod: 'ceil',
          }).toISOString()
        ).toEqual('2023-04-14T10:00:01.000Z');
      });
    });

    describe('sortDatesAscending', function () {
      it('should sort correctly', function () {
        expect(
          [
            { start: '2023-04-14T10:00:00.500Z' },
            { start: null },
            { start: '2023-04-14T10:00:00.501Z' },
            { start: undefined },
            { start: '2023-04-14T10:00:00.499Z' },
          ].toSorted((a, b) => sortDatesAscending(a.start, b.start))
        ).toEqual([
          { start: null },
          { start: undefined },
          { start: '2023-04-14T10:00:00.499Z' },
          { start: '2023-04-14T10:00:00.500Z' },
          { start: '2023-04-14T10:00:00.501Z' },
        ]);
      });
    });
  });

  describe('sortDatesDescending', function () {
    it('should sort correctly', function () {
      expect(
        [
          { start: '2023-04-14T10:00:00.500Z' },
          { start: null },
          { start: '2023-04-14T10:00:00.501Z' },
          { start: undefined },
          { start: '2023-04-14T10:00:00.499Z' },
        ].toSorted((a, b) => sortDatesDescending(a.start, b.start))
      ).toEqual([
        { start: '2023-04-14T10:00:00.501Z' },
        { start: '2023-04-14T10:00:00.500Z' },
        { start: '2023-04-14T10:00:00.499Z' },
        { start: null },
        { start: undefined },
      ]);
    });
  });

  describe('formatDate', function () {
    it('should format date correctly', function () {
      expect(formatDate('2023-04-14T10:00:00.500Z', 'en')).toEqual(
        'Fri, Apr 14, 2023'
      );

      expect(formatDate('2023-04-14T10:00:00.500Z', 'de')).toEqual(
        'Fr., 14. Apr. 2023'
      );
    });
  });

  describe('formatNumericDate', function () {
    it('should format date correctly', function () {
      expect(formatNumericDate('2023-04-14T10:00:00.500Z', 'en')).toEqual(
        '04/14/2023'
      );

      expect(formatNumericDate('2023-04-14T10:00:00.500Z', 'de')).toEqual(
        '14.04.2023'
      );
    });
  });

  describe('timeDiff', function () {
    it('should calculate time diff', function () {
      expect(
        timeDiff('2023-04-14T10:01:00.500Z', '2023-04-14T10:00:00.500Z')
      ).toEqual(60_000);
    });

    it('should calculate time a negative diff', function () {
      expect(
        timeDiff('2023-04-14T10:00:00.500Z', '2023-04-14T10:01:00.500Z')
      ).toEqual(-60_000);
    });
  });

  describe('calculateDiffSum', function () {
    it('should calculate time diff', function () {
      expect(
        calculateDiffSum([
          {
            start: '2023-04-14T10:00:00.500Z',
            end: '2023-04-14T10:01:00.500Z',
          },
          {
            start: '2023-04-15T10:00:00.500Z',
            end: '2023-04-15T10:01:00.500Z',
          },
        ])
      ).toEqual(120_000);
    });
  });
});

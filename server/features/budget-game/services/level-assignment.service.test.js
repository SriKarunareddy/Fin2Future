/**
 * Unit Tests for Level Assignment Engine Service
 */

const { assignLevel, getLevelThresholds, LEVEL_THRESHOLDS } = require('./level-assignment.service');

describe('Level Assignment Engine Service', () => {
  describe('assignLevel()', () => {
    describe('Basic level assignment', () => {
      test('should assign "Basic" for score 0', () => {
        expect(assignLevel(0)).toBe('Basic');
      });

      test('should assign "Basic" for score 1', () => {
        expect(assignLevel(1)).toBe('Basic');
      });

      test('should assign "Basic" for score 2', () => {
        expect(assignLevel(2)).toBe('Basic');
      });

      test('should assign "Basic" for score 3', () => {
        expect(assignLevel(3)).toBe('Basic');
      });
    });

    describe('Medium level assignment', () => {
      test('should assign "Medium" for score 4', () => {
        expect(assignLevel(4)).toBe('Medium');
      });

      test('should assign "Medium" for score 5', () => {
        expect(assignLevel(5)).toBe('Medium');
      });

      test('should assign "Medium" for score 6', () => {
        expect(assignLevel(6)).toBe('Medium');
      });

      test('should assign "Medium" for score 7', () => {
        expect(assignLevel(7)).toBe('Medium');
      });
    });

    describe('Advanced level assignment', () => {
      test('should assign "Advanced" for score 8', () => {
        expect(assignLevel(8)).toBe('Advanced');
      });

      test('should assign "Advanced" for score 9', () => {
        expect(assignLevel(9)).toBe('Advanced');
      });

      test('should assign "Advanced" for score 10', () => {
        expect(assignLevel(10)).toBe('Advanced');
      });
    });

    describe('Error handling', () => {
      test('should throw error for negative score', () => {
        expect(() => assignLevel(-1)).toThrow('Score must be between 0 and 10');
      });

      test('should throw error for score greater than 10', () => {
        expect(() => assignLevel(11)).toThrow('Score must be between 0 and 10');
      });

      test('should throw error for non-number score', () => {
        expect(() => assignLevel('5')).toThrow('Score must be a number');
      });

      test('should throw error for null score', () => {
        expect(() => assignLevel(null)).toThrow('Score must be a number');
      });

      test('should throw error for undefined score', () => {
        expect(() => assignLevel(undefined)).toThrow('Score must be a number');
      });

      test('should throw error for decimal score', () => {
        expect(() => assignLevel(5.5)).toThrow('Score must be an integer');
      });

      test('should throw error for NaN', () => {
        expect(() => assignLevel(NaN)).toThrow('Score must be between 0 and 10');
      });
    });
  });

  describe('getLevelThresholds()', () => {
    test('should return threshold configuration', () => {
      const thresholds = getLevelThresholds();
      
      expect(thresholds).toHaveProperty('BASIC');
      expect(thresholds).toHaveProperty('MEDIUM');
      expect(thresholds).toHaveProperty('ADVANCED');
    });

    test('should return correct Basic threshold values', () => {
      const thresholds = getLevelThresholds();
      
      expect(thresholds.BASIC.min).toBe(0);
      expect(thresholds.BASIC.max).toBe(3);
    });

    test('should return correct Medium threshold values', () => {
      const thresholds = getLevelThresholds();
      
      expect(thresholds.MEDIUM.min).toBe(4);
      expect(thresholds.MEDIUM.max).toBe(7);
    });

    test('should return correct Advanced threshold values', () => {
      const thresholds = getLevelThresholds();
      
      expect(thresholds.ADVANCED.min).toBe(8);
      expect(thresholds.ADVANCED.max).toBe(10);
    });

    test('should return a copy, not the original object', () => {
      const thresholds = getLevelThresholds();
      
      // Modify the returned object
      thresholds.BASIC.min = 999;
      
      // Original should be unchanged
      expect(LEVEL_THRESHOLDS.BASIC.min).toBe(0);
    });

    test('should return consistent values on multiple calls', () => {
      const thresholds1 = getLevelThresholds();
      const thresholds2 = getLevelThresholds();
      
      expect(thresholds1).toEqual(thresholds2);
    });
  });

  describe('LEVEL_THRESHOLDS configuration', () => {
    test('should have no gaps in score ranges', () => {
      // Check that max of one level + 1 equals min of next level
      expect(LEVEL_THRESHOLDS.BASIC.max + 1).toBe(LEVEL_THRESHOLDS.MEDIUM.min);
      expect(LEVEL_THRESHOLDS.MEDIUM.max + 1).toBe(LEVEL_THRESHOLDS.ADVANCED.min);
    });

    test('should cover the full score range 0-10', () => {
      expect(LEVEL_THRESHOLDS.BASIC.min).toBe(0);
      expect(LEVEL_THRESHOLDS.ADVANCED.max).toBe(10);
    });

    test('should have valid min/max relationships', () => {
      // Each level's min should be <= max
      expect(LEVEL_THRESHOLDS.BASIC.min).toBeLessThanOrEqual(LEVEL_THRESHOLDS.BASIC.max);
      expect(LEVEL_THRESHOLDS.MEDIUM.min).toBeLessThanOrEqual(LEVEL_THRESHOLDS.MEDIUM.max);
      expect(LEVEL_THRESHOLDS.ADVANCED.min).toBeLessThanOrEqual(LEVEL_THRESHOLDS.ADVANCED.max);
    });
  });
});

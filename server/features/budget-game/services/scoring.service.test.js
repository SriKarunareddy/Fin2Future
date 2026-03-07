/**
 * Unit Tests for Scoring Engine Service
 */

const {
  calculateScore,
  isAnswerCorrect,
  validateResponseFormat,
  validateResponses
} = require('./scoring.service');

describe('Scoring Engine Service', () => {
  describe('validateResponseFormat', () => {
    test('should validate a correct response format', () => {
      const response = {
        questionId: 1,
        selectedOption: 'A'
      };
      const result = validateResponseFormat(response);
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    test('should reject non-object response', () => {
      const result = validateResponseFormat(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Response must be an object');
    });

    test('should reject response without questionId', () => {
      const response = { selectedOption: 'A' };
      const result = validateResponseFormat(response);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('questionId');
    });

    test('should reject response with invalid questionId range', () => {
      const response = { questionId: 11, selectedOption: 'A' };
      const result = validateResponseFormat(response);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('between 1 and 10');
    });

    test('should reject response without selectedOption', () => {
      const response = { questionId: 1 };
      const result = validateResponseFormat(response);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('selectedOption');
    });

    test('should reject response with invalid selectedOption', () => {
      const response = { questionId: 1, selectedOption: 'E' };
      const result = validateResponseFormat(response);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('A, B, C, D');
    });
  });

  describe('validateResponses', () => {
    const validResponses = [
      { questionId: 1, selectedOption: 'A' },
      { questionId: 2, selectedOption: 'B' },
      { questionId: 3, selectedOption: 'C' },
      { questionId: 4, selectedOption: 'D' },
      { questionId: 5, selectedOption: 'A' },
      { questionId: 6, selectedOption: 'B' },
      { questionId: 7, selectedOption: 'C' },
      { questionId: 8, selectedOption: 'D' },
      { questionId: 9, selectedOption: 'A' },
      { questionId: 10, selectedOption: 'B' }
    ];

    test('should validate correct responses array', () => {
      const result = validateResponses(validResponses);
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    test('should reject non-array input', () => {
      const result = validateResponses('not an array');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Responses must be an array');
    });

    test('should reject responses with wrong count', () => {
      const result = validateResponses([{ questionId: 1, selectedOption: 'A' }]);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Expected 10 responses');
    });

    test('should reject responses with duplicate question IDs', () => {
      const duplicateResponses = [
        ...validResponses.slice(0, 9),
        { questionId: 1, selectedOption: 'A' } // Duplicate of first
      ];
      const result = validateResponses(duplicateResponses);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Duplicate question IDs');
    });

    test('should reject responses with missing question ID', () => {
      const incompleteResponses = [
        { questionId: 1, selectedOption: 'A' },
        { questionId: 2, selectedOption: 'B' },
        { questionId: 3, selectedOption: 'C' },
        { questionId: 4, selectedOption: 'D' },
        { questionId: 5, selectedOption: 'A' },
        { questionId: 6, selectedOption: 'B' },
        { questionId: 7, selectedOption: 'C' },
        { questionId: 8, selectedOption: 'D' },
        { questionId: 9, selectedOption: 'A' },
        { questionId: 11, selectedOption: 'B' } // Wrong ID, missing 10
      ];
      const result = validateResponses(incompleteResponses);
      expect(result.isValid).toBe(false);
    });
  });

  describe('isAnswerCorrect', () => {
    test('should return true for correct answer to question 1', () => {
      // Question 1: "What is a budget?" - Correct answer: A
      expect(isAnswerCorrect(1, 'A')).toBe(true);
    });

    test('should return false for incorrect answer to question 1', () => {
      expect(isAnswerCorrect(1, 'B')).toBe(false);
      expect(isAnswerCorrect(1, 'C')).toBe(false);
      expect(isAnswerCorrect(1, 'D')).toBe(false);
    });

    test('should return true for correct answer to question 2', () => {
      // Question 2: "What does APR stand for?" - Correct answer: B
      expect(isAnswerCorrect(2, 'B')).toBe(true);
    });

    test('should throw error for invalid questionId', () => {
      expect(() => isAnswerCorrect(0, 'A')).toThrow('Invalid questionId');
      expect(() => isAnswerCorrect(11, 'A')).toThrow('Invalid questionId');
      expect(() => isAnswerCorrect('1', 'A')).toThrow('Invalid questionId');
    });

    test('should throw error for invalid selectedOption', () => {
      expect(() => isAnswerCorrect(1, 'E')).toThrow('Invalid selectedOption');
      expect(() => isAnswerCorrect(1, 'a')).toThrow('Invalid selectedOption');
      expect(() => isAnswerCorrect(1, 1)).toThrow('Invalid selectedOption');
    });
  });

  describe('calculateScore', () => {
    test('should calculate score of 10 for all correct answers', () => {
      const allCorrectResponses = [
        { questionId: 1, selectedOption: 'A' },
        { questionId: 2, selectedOption: 'B' },
        { questionId: 3, selectedOption: 'C' },
        { questionId: 4, selectedOption: 'A' },
        { questionId: 5, selectedOption: 'B' },
        { questionId: 6, selectedOption: 'B' },
        { questionId: 7, selectedOption: 'B' },
        { questionId: 8, selectedOption: 'C' },
        { questionId: 9, selectedOption: 'B' },
        { questionId: 10, selectedOption: 'B' }
      ];
      expect(calculateScore(allCorrectResponses)).toBe(10);
    });

    test('should calculate score of 0 for all incorrect answers', () => {
      const allIncorrectResponses = [
        { questionId: 1, selectedOption: 'B' },
        { questionId: 2, selectedOption: 'A' },
        { questionId: 3, selectedOption: 'A' },
        { questionId: 4, selectedOption: 'B' },
        { questionId: 5, selectedOption: 'A' },
        { questionId: 6, selectedOption: 'A' },
        { questionId: 7, selectedOption: 'A' },
        { questionId: 8, selectedOption: 'A' },
        { questionId: 9, selectedOption: 'A' },
        { questionId: 10, selectedOption: 'A' }
      ];
      expect(calculateScore(allIncorrectResponses)).toBe(0);
    });

    test('should calculate score of 5 for half correct answers', () => {
      const mixedResponses = [
        { questionId: 1, selectedOption: 'A' }, // Correct
        { questionId: 2, selectedOption: 'B' }, // Correct
        { questionId: 3, selectedOption: 'C' }, // Correct
        { questionId: 4, selectedOption: 'A' }, // Correct
        { questionId: 5, selectedOption: 'B' }, // Correct
        { questionId: 6, selectedOption: 'A' }, // Incorrect
        { questionId: 7, selectedOption: 'A' }, // Incorrect
        { questionId: 8, selectedOption: 'A' }, // Incorrect
        { questionId: 9, selectedOption: 'A' }, // Incorrect
        { questionId: 10, selectedOption: 'A' } // Incorrect
      ];
      expect(calculateScore(mixedResponses)).toBe(5);
    });

    test('should throw error for invalid responses format', () => {
      expect(() => calculateScore('not an array')).toThrow('Responses must be an array');
    });

    test('should throw error for wrong number of responses', () => {
      const tooFewResponses = [
        { questionId: 1, selectedOption: 'A' },
        { questionId: 2, selectedOption: 'B' }
      ];
      expect(() => calculateScore(tooFewResponses)).toThrow('Expected 10 responses');
    });

    test('should throw error for duplicate question IDs', () => {
      const duplicateResponses = [
        { questionId: 1, selectedOption: 'A' },
        { questionId: 1, selectedOption: 'B' },
        { questionId: 3, selectedOption: 'C' },
        { questionId: 4, selectedOption: 'D' },
        { questionId: 5, selectedOption: 'A' },
        { questionId: 6, selectedOption: 'B' },
        { questionId: 7, selectedOption: 'C' },
        { questionId: 8, selectedOption: 'D' },
        { questionId: 9, selectedOption: 'A' },
        { questionId: 10, selectedOption: 'B' }
      ];
      expect(() => calculateScore(duplicateResponses)).toThrow('Duplicate question IDs');
    });

    test('should calculate correct score for edge case with score of 1', () => {
      const oneCorrectResponse = [
        { questionId: 1, selectedOption: 'A' }, // Correct
        { questionId: 2, selectedOption: 'A' }, // Incorrect
        { questionId: 3, selectedOption: 'A' }, // Incorrect
        { questionId: 4, selectedOption: 'B' }, // Incorrect
        { questionId: 5, selectedOption: 'A' }, // Incorrect
        { questionId: 6, selectedOption: 'A' }, // Incorrect
        { questionId: 7, selectedOption: 'A' }, // Incorrect
        { questionId: 8, selectedOption: 'A' }, // Incorrect
        { questionId: 9, selectedOption: 'A' }, // Incorrect
        { questionId: 10, selectedOption: 'A' } // Incorrect
      ];
      expect(calculateScore(oneCorrectResponse)).toBe(1);
    });

    test('should calculate correct score for edge case with score of 9', () => {
      const nineCorrectResponses = [
        { questionId: 1, selectedOption: 'A' }, // Correct
        { questionId: 2, selectedOption: 'B' }, // Correct
        { questionId: 3, selectedOption: 'C' }, // Correct
        { questionId: 4, selectedOption: 'A' }, // Correct
        { questionId: 5, selectedOption: 'B' }, // Correct
        { questionId: 6, selectedOption: 'B' }, // Correct
        { questionId: 7, selectedOption: 'B' }, // Correct
        { questionId: 8, selectedOption: 'C' }, // Correct
        { questionId: 9, selectedOption: 'B' }, // Correct
        { questionId: 10, selectedOption: 'A' } // Incorrect
      ];
      expect(calculateScore(nineCorrectResponses)).toBe(9);
    });
  });
});

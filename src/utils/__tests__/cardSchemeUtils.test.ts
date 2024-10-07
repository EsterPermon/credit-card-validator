import { describe, it, expect, vi, beforeEach, afterEach, MockInstance } from 'vitest';
import {
  findMatchingCardScheme,
  parseDigitsRule,
  parseIntervalRule,
  parseValidationRules,
  validateCardLength,
  validateCardRange,
} from '../cardSchemeUtils';
import mockedProcessedSchemeRulesJson from '../../api/cardScheme/__fixtures__/mockedProcessedRules.json';
import { ProcessedSchemeRule, ValidationType } from '../../api/cardScheme/types';

const schemeDetectionRules = mockedProcessedSchemeRulesJson as ProcessedSchemeRule[];

describe('CardSchemeUtils', () => {
  let consoleErrorSpy: MockInstance;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('findMatchingCardScheme', () => {
    it('should find a matching card scheme by length and range', () => {
      expect(findMatchingCardScheme('4111111111111111', schemeDetectionRules)?.id).toBe('visa');
      expect(findMatchingCardScheme('341111111111111', schemeDetectionRules)?.id).toBe('amex');
      expect(findMatchingCardScheme('3530111333300000', schemeDetectionRules)?.id).toBe('jcb');
      expect(findMatchingCardScheme('5105105105105100', schemeDetectionRules)?.id).toBe('master');
    });

    it('should return undefined if no matching card scheme is found', () => {
      expect(findMatchingCardScheme('1234567890123456', schemeDetectionRules)).toBeUndefined();
      expect(findMatchingCardScheme('6011111111111111', schemeDetectionRules)).toBeUndefined();
      expect(findMatchingCardScheme('', schemeDetectionRules)).toBeUndefined();
      expect(findMatchingCardScheme('0000000000000000', schemeDetectionRules)).toBeUndefined();
    });
  });

  describe('validateCardLength', () => {
    it('should validate length correctly for digits type', () => {
      const lengthRules = [{ type: 'digits', value: 16 }] as ValidationType[];

      expect(validateCardLength('4111111111111111', lengthRules)).toBe(true);
      expect(validateCardLength('411111111111111', lengthRules)).toBe(false);
    });

    it('should validate length correctly for interval type', () => {
      const lengthRules = [{ type: 'interval', value: { min: 13, max: 16 } }] as ValidationType[];

      expect(validateCardLength('411111111111', lengthRules)).toBe(false);
      expect(validateCardLength('4111111111111', lengthRules)).toBe(true);
      expect(validateCardLength('41111111111111', lengthRules)).toBe(true);
      expect(validateCardLength('411111111111111', lengthRules)).toBe(true);
      expect(validateCardLength('4111111111111111', lengthRules)).toBe(true);
      expect(validateCardLength('41111111111111111', lengthRules)).toBe(false);
    });
  });

  describe('validateCardRange', () => {
    it('should validate range correctly for digits type', () => {
      const rangeRules = [
        { type: 'digits', value: 4 },
        { type: 'digits', value: 50 },
        { type: 'digits', value: 5444 },
      ] as ValidationType[];
      expect(validateCardRange('4111111111111111', rangeRules)).toBe(true);
      expect(validateCardRange('5011111111111111', rangeRules)).toBe(true);
      expect(validateCardRange('5444111111111111', rangeRules)).toBe(true);
      expect(validateCardRange('5111111111111111', rangeRules)).toBe(false);
    });

    it('should validate range correctly for interval type', () => {
      const rangeRules = [{ type: 'interval', value: { min: 40, max: 44 } }] as ValidationType[];
      expect(validateCardRange('3911111111111111', rangeRules)).toBe(false);
      expect(validateCardRange('4011111111111111', rangeRules)).toBe(true);
      expect(validateCardRange('4111111111111111', rangeRules)).toBe(true);
      expect(validateCardRange('4211111111111111', rangeRules)).toBe(true);
      expect(validateCardRange('4311111111111111', rangeRules)).toBe(true);
      expect(validateCardRange('4411111111111111', rangeRules)).toBe(true);
      expect(validateCardRange('4511111111111111', rangeRules)).toBe(false);
    });
  });

  describe('parseDigitsRule', () => {
    it('should create a valid digits rule', () => {
      expect(parseDigitsRule(['4'])).toEqual({ type: 'digits', value: 4 });
    });

    it('should disconsider and console error for invalid rule', () => {
      const result = parseDigitsRule(['a']);
      expect(result).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid rule - a');
    });
  });

  describe('parseIntervalRule', () => {
    it('should create a valid interval rule', () => {
      expect(parseIntervalRule(['40', '49'])).toEqual({ type: 'interval', value: { min: 40, max: 49 } });
    });

    it('should disconsider and console error for invalid input', () => {
      const result1 = parseIntervalRule(['49']);
      expect(result1).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid rule - 49');

      const result2 = parseIntervalRule(['50', '40']);
      expect(result2).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid rule - 50,40');

      const result3 = parseIntervalRule(['a', 'b']);
      expect(result3).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid rule - a,b');
    });
  });

  describe('parseValidationRules', () => {
    it('should parse single digits rule', () => {
      expect(parseValidationRules('4')).toEqual([{ type: 'digits', value: 4 }]);
    });

    it('should parse interval rule', () => {
      expect(parseValidationRules('40-49')).toEqual([{ type: 'interval', value: { min: 40, max: 49 } }]);
    });

    it('should parse multiple rules', () => {
      expect(parseValidationRules('4,40-49')).toEqual([
        { type: 'digits', value: 4 },
        { type: 'interval', value: { min: 40, max: 49 } },
      ]);
    });
  });
});

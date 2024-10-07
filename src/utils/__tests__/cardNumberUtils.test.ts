import { describe, it, expect } from 'vitest';
import { doubleEverySecondDigitFromRight, isNumberValid, stringToArray, sumUpDigits } from '../cardNumberUtils';

describe('CardNumberUtils', () => {
  describe('stringToArray', () => {
    it('should return empty array when string is empty', () => {
      const array = stringToArray('');
      expect(array).toEqual([]);
      expect(array.length).toEqual(0);
    });

    it('should return array length 1 when string is a char', () => {
      const array = stringToArray('1');
      expect(array).toEqual(['1']);
      expect(array.length).toEqual(1);
    });

    it('should split string into an array of characters', () => {
      const array = stringToArray('123');
      expect(array).toEqual(['1', '2', '3']);
      expect(array.length).toEqual(3);
    });
  });

  describe('sumUpDigits', () => {
    it('should return 0 when string is empty', () => {
      expect(sumUpDigits('')).toEqual(0);
    });

    it('should return 0 when string is 0', () => {
      expect(sumUpDigits('0')).toEqual(0);
    });

    it('should return 0 when string is a sequence of 0s', () => {
      expect(sumUpDigits('000')).toEqual(0);
    });

    it('should return the sum of all digits in a string', () => {
      expect(sumUpDigits('123')).toEqual(6);
    });

    it('should sum correctly when all digits are the same', () => {
      expect(sumUpDigits('999')).toEqual(27);
    });
  });

  describe('doubleEverySecondDigitFromRight', () => {
    it('should return empty string when given string is empty', () => {
      expect(doubleEverySecondDigitFromRight('')).toEqual('');
    });

    it('should handle strings with only 0s', () => {
      expect(doubleEverySecondDigitFromRight('0000')).toEqual('0000');
    });

    it('should double only second digits from right on string length even', () => {
      expect(doubleEverySecondDigitFromRight('1234')).toEqual('2264');
    });

    it('should double only second digits from right on string length odd', () => {
      expect(doubleEverySecondDigitFromRight('12341')).toEqual('14381');
    });

    it('should append both digits when double has 2 digits', () => {
      expect(doubleEverySecondDigitFromRight('16397')).toEqual('1123187');
    });
  });

  describe('isNumberValid', () => {
    it('should return true when number is all 0s', () => {
      expect(isNumberValid('0000000000000000')).toBe(true);
    });

    it('should return true for valid card numbers', () => {
      expect(isNumberValid('4532015112830366')).toBe(true);
      expect(isNumberValid('6011514433546201')).toBe(true);
    });

    it('should return false for invalid card numbers', () => {
      expect(isNumberValid('4532015112830367')).toBe(false);
      expect(isNumberValid('6011514433546202')).toBe(false);
    });
  });
});

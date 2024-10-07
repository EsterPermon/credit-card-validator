import { DigitsRange, IntervalRange, ValidationType, ProcessedSchemeRule } from '../api/cardScheme/types';

export const findMatchingCardScheme = (cardNumber: string, schemeDetectionRules: ProcessedSchemeRule[]) => {
  return schemeDetectionRules.find(
    (rule) =>
      validateCardLength(cardNumber, rule.lengthValidations) && validateCardRange(cardNumber, rule.rangeValidations)
  );
};

export const validateCardLength = (cardNumber: string, lengthRules: ValidationType[]) => {
  const matchingLength = lengthRules.find((lengthRule) => {
    if (lengthRule.type === 'digits') {
      return cardNumber.length === lengthRule.value;
    }
    return cardNumber.length >= lengthRule.value.min && cardNumber.length <= lengthRule.value.max;
  });

  return Boolean(matchingLength);
};

export const validateCardRange = (cardNumber: string, rangeRules: ValidationType[]) => {
  const matchingRange = rangeRules.find((rangeRule) => {
    if (rangeRule.type === 'digits') {
      return cardNumber.startsWith(String(rangeRule.value));
    }

    for (let i = rangeRule.value.min; i <= rangeRule.value.max; i++) {
      if (cardNumber.startsWith(String(i))) {
        return true;
      }
    }
  });
  return Boolean(matchingRange);
};

export const parseDigitsRule = (digits: string[]): DigitsRange | undefined => {
  const parsedInt = parseInt(digits[0]);
  if (Number.isNaN(parsedInt)) {
    console.error(`Invalid rule - ${digits[0]}`);
    return;
  }
  return { type: 'digits', value: parsedInt };
};

export const parseIntervalRule = (interval: string[]): IntervalRange | undefined => {
  if (interval.length !== 2) {
    console.error(`Invalid rule - ${interval}`);
    return;
  }

  const parsedMin = parseInt(interval[0]);
  const parsedMax = parseInt(interval[1]);

  if (Number.isNaN(parsedMin) || Number.isNaN(parsedMax) || parsedMin > parsedMax) {
    console.error(`Invalid rule - ${interval}`);
    return;
  }

  return { type: 'interval', value: { min: parsedMin, max: parsedMax } };
};

export const parseValidationRules = (ranges: string): ValidationType[] => {
  return ranges.split(',').reduce<ValidationType[]>((acc, item) => {
    const range = item.split('-');

    const parsedRule = range.length > 1 ? parseIntervalRule(range) : parseDigitsRule(range);
    if (parsedRule) {
      acc.push(parsedRule);
    }

    return acc;
  }, []);
};

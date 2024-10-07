export type IntervalRange = { type: 'interval'; value: { min: number; max: number } };

export type DigitsRange = { type: 'digits'; value: number };

export type ValidationType = IntervalRange | DigitsRange;

type RawSchemeDetectionRule = {
  id: string;
  name: string;
  ranges: string;
  length: string;
  icon: string;
};

export type SchemeRulesResponse = {
  type: string;
  data: RawSchemeDetectionRule[];
};

export type ProcessedSchemeRule = {
  id: string;
  name: string;
  rangeValidations: ValidationType[];
  lengthValidations: ValidationType[];
  icon: string;
};

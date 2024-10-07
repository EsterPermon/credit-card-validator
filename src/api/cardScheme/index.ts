import { parseValidationRules } from '../../utils/cardSchemeUtils';
import { SchemeRulesResponse, ProcessedSchemeRule } from './types';

const BASE_URL = 'https://sumup-op-hiring-test.s3.eu-west-1.amazonaws.com';
const MAX_INT_64 = BigInt('9223372036854775807');

export const generateRandomRequestId = () => {
  return BigInt(Math.floor(Number(Math.random() * Number(MAX_INT_64)))) + 1n;
};

export const fetchSchemeDetectionRules = async (): Promise<ProcessedSchemeRule[]> => {
  let retries = 3;
  while (retries > 0) {
    const requestId = generateRandomRequestId();
    try {
      const response = await fetch(`${BASE_URL}/api-mock/cards-dictionary.json?request_id=${requestId}`, {
        signal: AbortSignal.timeout(5000),
      });

      if (response.status === 500) {
        throw new Error('Server Error: 500');
      }

      const data = await response.json();
      return parseResponse(data);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Request failed: ${error.name} - ${error.message}. Retries left: ${retries - 1}`);
        retries--;

        if (retries === 0) {
          console.error('All retries failed. No more attempts.');
          throw error;
        }
      }
    }
  }
  return [];
};

export const parseResponse = (response: SchemeRulesResponse): ProcessedSchemeRule[] => {
  if (typeof response !== 'object' || response === null || !('data' in response) || !Array.isArray(response.data)) {
    throw new Error('Malformed Response');
  }
  const rules = response.data;

  return rules.map((rule) => {
    const parsedRanges = parseValidationRules(rule.ranges);
    const parsedLengths = parseValidationRules(rule.length);

    return {
      id: rule.id,
      name: rule.name,
      rangeValidations: parsedRanges,
      lengthValidations: parsedLengths,
      icon: rule.icon,
    };
  });
};

import { describe, it, expect, vi, Mock, afterEach } from 'vitest';
import { fetchSchemeDetectionRules, generateRandomRequestId, parseResponse } from '..';
import { ProcessedSchemeRule, SchemeRulesResponse } from '../types';
import mockedProcessedSchemeRulesJson from '../__fixtures__/mockedProcessedRules.json';
import mockedSchemeRulesJson from '../__fixtures__/mockedSchemeRules.json';

global.fetch = vi.fn();
const fetchMock = fetch as Mock;

const schemeDetectionRulesProcessed = mockedProcessedSchemeRulesJson as ProcessedSchemeRule[];
const schemeDetectionRulesRaw = mockedSchemeRulesJson as SchemeRulesResponse;

describe('CardSchemeApi', () => {
  describe('generateRandomRequestId', () => {
    it('should generate a valid random request ID within the int64 range', () => {
      const requestId = generateRandomRequestId();
      expect(requestId).toBeGreaterThan(0n);
      expect(requestId).toBeLessThanOrEqual(BigInt('9223372036854775807'));
    });
  });

  describe('parseResponse', () => {
    it('should correctly parse a valid response', () => {
      const result = parseResponse(schemeDetectionRulesRaw);
      expect(result).toEqual(schemeDetectionRulesProcessed);
    });

    it('should throw "Malformed Response" error if response is not an object', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invalidResponse: any = [];

      expect(() => parseResponse(invalidResponse)).toThrow('Malformed Response');
    });
    it('should throw "Malformed Response" error if response is null', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const missingDataResponse: any = null;

      expect(() => parseResponse(missingDataResponse)).toThrow('Malformed Response');
    });
    it('should throw "Malformed Response" error if response is missing data', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const missingDataResponse: any = {
        type: 'dictionary-card-schemes',
      };

      expect(() => parseResponse(missingDataResponse)).toThrow('Malformed Response');
    });
    it('should throw "Malformed Response" error if data is not an array', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const missingDataResponse: any = {
        type: 'dictionary-card-schemes',
        data: 'invalid-type',
      };

      expect(() => parseResponse(missingDataResponse)).toThrow('Malformed Response');
    });
  });

  describe('fetchSchemeDetectionRules', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should fetch and parse scheme detection rules successfully', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => schemeDetectionRulesRaw,
      });

      const result = await fetchSchemeDetectionRules();
      expect(result).toEqual(schemeDetectionRulesProcessed);
    });

    it('should retry on 500 server error and after 3 tries throw after retries are exhausted', async () => {
      fetchMock.mockImplementation(() => Promise.resolve(new Response(null, { status: 500 })));
      await expect(fetchSchemeDetectionRules()).rejects.toThrow('Server Error: 500');
      expect(fetch).toHaveBeenCalledTimes(3);
    });

    it('should retry if response is malformed and after 3 tries throw after retries are exhausted', async () => {
      fetchMock.mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify({ type: 'dictionary-card-schemes', data: 'invalid_data' }), { status: 200 })
        )
      );
      await expect(fetchSchemeDetectionRules()).rejects.toThrow('Malformed Response');
      expect(fetch).toHaveBeenCalledTimes(3);
    });

    it('should timeout if the request takes too long, retry 3 times and  throw after retries are exhausted', async () => {
      const controller = new AbortController();

      fetchMock.mockImplementation(() => {
        return new Promise((_resolve, reject) => {
          const id = setTimeout(() => {
            controller.abort();
            reject(new Error('Request timed out'));
          }, 6000);

          controller.signal.addEventListener('abort', () => {
            clearTimeout(id);
            reject(new Error('Request timed out'));
          });
        });
      });

      await expect(fetchSchemeDetectionRules()).rejects.toThrow('Request timed out');
      expect(fetch).toHaveBeenCalledTimes(3);
    }, 19000);
  });
});

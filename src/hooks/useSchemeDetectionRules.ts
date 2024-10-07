import React from 'react';
import { ProcessedSchemeRule } from '../api/cardScheme/types';
import { fetchSchemeDetectionRules } from '../api/cardScheme';

export const useSchemeDetectionRules = () => {
  const [isError, setIserror] = React.useState('');
  const [schemeDetectionRules, setSchemeDetectionRules] = React.useState<ProcessedSchemeRule[]>([]);

  React.useEffect(() => {
    if (!schemeDetectionRules.length) {
      fetchSchemeDetectionRules()
        .then((response) => {
          setSchemeDetectionRules(response);
          setIserror('');
        })
        .catch((error) => setIserror(error.message));
    }
  }, [schemeDetectionRules]);

  return {
    isError,
    schemeDetectionRules,
  };
};

import React, { ChangeEvent } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import InputField from '../UI/InputField';
import CardUnknownIcon from '../../../public/card-unknown.svg';
import CardInvalidIcon from '../../../public/card-invalid.svg';
import { useTranslation } from 'react-i18next';
import Button from '../UI/Button';
import styles from './styles.module.css';
import debounce from 'lodash/debounce';
import { isNumberValid as isNumberValid } from '../../utils/cardNumberUtils';
import { findMatchingCardScheme } from '../../utils/cardSchemeUtils';
import { useSchemeDetectionRules } from '../../hooks/useSchemeDetectionRules';
import { TEST_IDS } from '../../utils/constants';

type FormValues = {
  cardNumber: string;
};

const CardForm = () => {
  const { t } = useTranslation();
  const [inputIcon, setInputIcon] = React.useState(CardUnknownIcon);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [isCardNumberValid, setIsCardNumberValid] = React.useState(false);

  const { handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: {
      cardNumber: '',
    },
  });

  const { isError, schemeDetectionRules } = useSchemeDetectionRules();

  const handleOnChange = React.useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (value) {
        setShowSuccessMessage(false);
        const isInputValid = isNumberValid(value);
        const cardScheme = findMatchingCardScheme(value, schemeDetectionRules);
        const cardSchemeIcon = cardScheme?.icon;
        const areSchemeRulesUnavailable = Boolean(schemeDetectionRules?.length);
        setIsCardNumberValid(isInputValid && (Boolean(cardScheme) || !areSchemeRulesUnavailable));
        if (cardSchemeIcon) {
          setInputIcon(isInputValid ? cardSchemeIcon : CardInvalidIcon);
        } else {
          setInputIcon(CardUnknownIcon);
        }
      }
    },
    [schemeDetectionRules]
  );

  const debouncedOnChange = React.useMemo(() => debounce(handleOnChange, 500), [handleOnChange]);

  const onSubmit: SubmitHandler<FormValues> = () => {
    reset({
      cardNumber: '',
    });
    setIsCardNumberValid(false);
    setShowSuccessMessage(true);
    setInputIcon(CardUnknownIcon);
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <Controller
          control={control}
          name="cardNumber"
          render={({ field: { value, onChange } }) => (
            <InputField
              id={TEST_IDS.INPUT_TEST_ID}
              placeholder={t('cardForm.input.placeholder')}
              label={t('cardForm.input.label')}
              onChange={(e) => {
                onChange(e);
                debouncedOnChange(e);
              }}
              value={value}
              iconId={TEST_IDS.CARD_ICON_TEST_ID}
              icon={inputIcon}
            />
          )}
        />
        <Button
          id={TEST_IDS.BUTTON_TEST_ID}
          label={t('cardForm.button.label')}
          disabled={!isCardNumberValid}
          onClick={handleSubmit(onSubmit)}
        />
        {isError ? (
          <div data-testid={TEST_IDS.ERROR_MESSAGE_TEST_ID} className={`${styles.message} ${styles.error}`}>
            {t('cardForm.error', { errorMessage: isError })}
          </div>
        ) : null}
        {showSuccessMessage ? (
          <div data-testid={TEST_IDS.SUCCESS_MESSAGE_TEST_ID} className={`${styles.message} ${styles.success}`}>
            {t('cardForm.sucessMessage')}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CardForm;

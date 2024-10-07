export const isNumberValid = (cardNumber: string) => {
  const doubledDigits = doubleEverySecondDigitFromRight(cardNumber);
  const sumedUpDigits = sumUpDigits(doubledDigits);
  return Boolean(sumedUpDigits % 10 === 0);
};

export const doubleEverySecondDigitFromRight = (cardNumber: string) => {
  const digits = stringToArray(cardNumber);
  let finalDigits = '';

  for (let i = digits.length - 1; i >= 0; i--) {
    if ((digits.length - i) % 2 === 0) {
      const doubledDigit = String(parseInt(digits[i]) * 2);
      finalDigits = `${doubledDigit}${finalDigits}`;
    } else {
      finalDigits = `${digits[i]}${finalDigits}`;
    }
  }

  return finalDigits;
};

export const sumUpDigits = (digits: string) => {
  return stringToArray(digits).reduce((totalSum: number, digit: string) => {
    return (totalSum += parseInt(digit));
  }, 0);
};

export const stringToArray = (value: string) => value.split('');

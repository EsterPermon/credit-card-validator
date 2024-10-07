import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { useSchemeDetectionRules } from '../../../hooks/useSchemeDetectionRules';
import { isNumberValid } from '../../../utils/cardNumberUtils';
import { findMatchingCardScheme } from '../../../utils/cardSchemeUtils';
import CardForm from '..';
import { TEST_IDS } from '../../../utils/constants';

vi.mock('../../../hooks/useSchemeDetectionRules');
vi.mock('../../../utils/cardNumberUtils');
vi.mock('../../../utils/cardSchemeUtils');
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('CardForm Integration Tests', () => {
  const mockUseSchemeDetectionRules = useSchemeDetectionRules as Mock;
  const mockIsCardNumberValid = isNumberValid as Mock;
  const mockFindMatchingCardScheme = findMatchingCardScheme as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component and verifiy the initial state', () => {
    mockUseSchemeDetectionRules.mockReturnValue({ isError: false, schemeDetectionRules: [] });
    render(<CardForm />);
    expect(screen.getByTestId(TEST_IDS.INPUT_TEST_ID)).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.BUTTON_TEST_ID)).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.CARD_ICON_TEST_ID)).toHaveAttribute(
      'src',
      expect.stringContaining('card-unknown.svg')
    );
    expect(screen.queryByTestId(TEST_IDS.SUCCESS_MESSAGE_TEST_ID)).toBeFalsy();
  });

  it('should enable the submit button when a valid card number is inputed', async () => {
    mockUseSchemeDetectionRules.mockReturnValue({ isError: false, schemeDetectionRules: [] });
    mockIsCardNumberValid.mockReturnValue(true);
    mockFindMatchingCardScheme.mockReturnValue({ icon: 'visa-icon.svg' });

    render(<CardForm />);
    const input = screen.getByTestId(TEST_IDS.INPUT_TEST_ID);
    const button = screen.getByTestId(TEST_IDS.BUTTON_TEST_ID);

    fireEvent.change(input, { target: { value: '4111111111111111' } });

    await waitFor(() => expect(button).toBeEnabled());
    expect(screen.getByTestId(TEST_IDS.CARD_ICON_TEST_ID)).toHaveAttribute('src', 'visa-icon.svg');
  });

  it('should disable the submit button when an invalid card number is inputed', async () => {
    mockUseSchemeDetectionRules.mockReturnValue({ isError: false, schemeDetectionRules: [] });
    mockIsCardNumberValid.mockReturnValue(false);
    mockFindMatchingCardScheme.mockReturnValue({ icon: 'visa-icon.svg' });

    render(<CardForm />);
    const input = screen.getByTestId(TEST_IDS.INPUT_TEST_ID);
    const button = screen.getByTestId(TEST_IDS.BUTTON_TEST_ID);

    fireEvent.change(input, { target: { value: '4111111111111112' } });

    await waitFor(() => expect(button).toBeDisabled());
    await waitFor(() =>
      expect(screen.getByTestId(TEST_IDS.CARD_ICON_TEST_ID)).toHaveAttribute(
        'src',
        expect.stringContaining('card-invalid.svg')
      )
    );
  });

  it('should handle errors in fetching scheme detection rules and render error message', async () => {
    mockUseSchemeDetectionRules.mockReturnValue({ isError: 'Network Error', schemeDetectionRules: [] });

    render(<CardForm />);
    expect(screen.getByTestId(TEST_IDS.ERROR_MESSAGE_TEST_ID)).toBeTruthy();
  });

  it('should reset the form and button state and show success message on submit', async () => {
    mockUseSchemeDetectionRules.mockReturnValue({ isError: false, schemeDetectionRules: [] });
    mockIsCardNumberValid.mockReturnValue(true);
    mockFindMatchingCardScheme.mockReturnValue({ icon: 'visa-icon.svg' });

    render(<CardForm />);
    const input = screen.getByTestId(TEST_IDS.INPUT_TEST_ID);
    const button = screen.getByTestId(TEST_IDS.BUTTON_TEST_ID);

    fireEvent.change(input, { target: { value: '4111111111111111' } });

    await waitFor(() => expect(button).toBeEnabled());

    fireEvent.click(button);

    await waitFor(() => expect(button).toBeDisabled());
    expect(screen.getByTestId(TEST_IDS.SUCCESS_MESSAGE_TEST_ID)).toBeTruthy();
    expect(input).toHaveValue(null);
    expect(screen.getByTestId(TEST_IDS.CARD_ICON_TEST_ID)).toHaveAttribute(
      'src',
      expect.stringContaining('card-unknown.svg')
    );
  });
});

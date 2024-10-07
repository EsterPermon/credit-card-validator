import { MouseEvent } from 'react';
import styles from './styles.module.css';

type EventType = MouseEvent<HTMLButtonElement>;

type ButtonProps = {
  id: string;
  onClick: (event: EventType) => void;
  label: string;
  disabled: boolean;
};

const Button = (props: ButtonProps) => {
  const { id, onClick, disabled, label } = props;

  return (
    <div className={styles.buttonContainer}>
      <button data-testid={id} className={styles.button} disabled={disabled} onClick={onClick}>
        {label}
      </button>
    </div>
  );
};

export default Button;

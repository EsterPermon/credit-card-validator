import React, { ChangeEvent } from 'react';
import styles from './styles.module.css';

type EventType = ChangeEvent<HTMLInputElement>;

type InputFieldProps = {
  id: string;
  placeholder: string;
  label: string;
  value: string;
  icon: string;
  iconId: string;
  onChange: (event: EventType) => void;
};

const InputField = (props: InputFieldProps) => {
  const { id, iconId, placeholder, label, value, icon, onChange } = props;
  const [isFocused, setIsFocused] = React.useState(false);

  const onFocusStyle = isFocused ? styles.inputFocused : '';

  return (
    <div className={`${styles.container} ${onFocusStyle}`}>
      <label>{label}</label>
      <div className={styles.field}>
        <img data-testid={iconId} src={icon} width={25} height={25} />
        <input
          data-testid={id}
          type="number"
          className={styles.input}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </div>
  );
};

export default InputField;

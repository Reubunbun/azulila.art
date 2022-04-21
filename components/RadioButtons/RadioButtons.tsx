import type { ReactNode } from 'react';
import { useState } from 'react';
import styles from './RadioButtons.module.css';

type OptionValue = number | string;

interface Option<T extends OptionValue> {
  display: string;
  value: T;
};

interface Props<T extends OptionValue> {
  groupName: string;
  options: Option<T>[];
  onValueSelected: (optionSelected: T) => void;
  selected?: T;
};

const RadioButtons = <T extends OptionValue>(
  {selected, groupName, options, onValueSelected}: Props<T> & { children?: ReactNode }
) => {

  return (
    <div className={styles.containerRadioButtonsGroup}>
      {options.map(option => (
        <div key={option.value} className={styles.containerRadioButton}>
          <label className={styles.radioButton} onClick={() => onValueSelected(option.value)}>
            <input
              type='radio'
              name={groupName}
              checked={selected === option.value}
              id={option.value as string}
              value={option.value}
              onChange={e => e.stopPropagation()}
            />
            <span className={styles.radioDot} />
          </label>
          <label className={styles.radioText} htmlFor={option.value as string}>
            {option.display}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioButtons;

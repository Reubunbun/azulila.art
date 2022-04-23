import type { ReactNode } from 'react';
import styles from './RadioButtons.module.css';

type OptionValue = number | string;

interface Option<T extends OptionValue> {
  display: string;
  price?: number;
  newPrice?: number;
  offer?: number | null;
  value: T;
};

interface Props<T extends OptionValue> {
  groupName: string;
  small?: boolean;
  options: Option<T>[];
  onValueSelected: (optionSelected: T) => void;
  selected?: T;
};

const formatPrice = (price: number): string => {
  if (price % 1 === 0) {
    return String(price);
  }
  return price.toFixed(2);
};

const RadioButtons = <T extends OptionValue>(
  {selected, small, groupName, options, onValueSelected}: Props<T> & { children?: ReactNode }
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
          <label
            className={`${styles.radioText} ${small ? styles.small : ''}`}
            htmlFor={option.value as string}
          >
            {option.display}
            {option.price ?
              option.newPrice
                ? <>
                    <s>(${option.price})</s> <br />
                    <span className='highlight-text'>(${formatPrice(option.newPrice)} - {option.offer}% Off!)</span>
                  </>
                : `($${option.price})`
              : ''
            }
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioButtons;

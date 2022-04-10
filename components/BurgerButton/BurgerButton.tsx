import { useState, memo } from 'react';
import styles from './BurgerButton.module.css';

interface Props {
  onClick: Function;
};

const BurgerButton = ({ onClick }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      className={`${styles.burgerBtn} ${open ? styles.open : ''}`}
      onClick={() => {
        setOpen(prev => !prev);
        onClick();
      }}
    >
      <span />
      <span />
      <span />
    </div>
  );
};

export default memo(BurgerButton);

import { type FC, type MouseEventHandler, memo } from 'react';
import styles from './BurgerButton.module.css';

interface Props {
  onClick: MouseEventHandler<HTMLDivElement>;
  isOpen: boolean;
};

const BurgerButton: FC<Props> = ({ onClick, isOpen }) => {

  return (
    <div
      className={`${styles.burgerBtn} ${isOpen ? styles.open : ''}`}
      onClick={onClick}
    >
      <span />
      <span />
      <span />
    </div>
  );
};

export default memo(BurgerButton);

import { useState, useContext, memo } from 'react';
import AppStateContext from '../../context/AppStateProvider';
import styles from './BurgerButton.module.css';

interface Props {
  onClick: Function;
};

const BurgerButton = ({ onClick }: Props) => {
  const {navOpen} = useContext(AppStateContext);

  return (
    <div
      className={`${styles.burgerBtn} ${navOpen ? styles.open : ''}`}
      onClick={() => {
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

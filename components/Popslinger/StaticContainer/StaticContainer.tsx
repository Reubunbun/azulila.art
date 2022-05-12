import type { FC, ReactNode } from 'react';
import styles from './StaticContainer.module.css';

interface Props {
  children: ReactNode;
};

const StaticContainer: FC<Props> = ({ children }) => {
  return (
    <div className={styles.staticContainer}>{children}</div>
  );
};

export default StaticContainer;

import type { FC } from 'react';
import styles from './CommissionHeaderText.module.css';

interface Props {
  title: string;
  priceTotal: number;
};

const CommissionHeaderText: FC<Props> = ({title, priceTotal}) => {
  return (
    <div className={styles.containerCommissionHeader}>
      <h2>{title}</h2>
      {priceTotal > 0 &&
        <p>
          Current Total - ${priceTotal}
        </p>
      }
    </div>
  );
};

export default CommissionHeaderText;

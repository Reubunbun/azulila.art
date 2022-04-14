import type { FC } from 'react';
import styles from './LoadingSpinner.module.css';

interface Props {
  loadingText: string;
  width?: `${number}rem`;
  height?: `${number}rem`;
};

const LoadingSpinner: FC<Props> = ({
  loadingText,
  width,
  height,
}) => {
  return (
    <div className={styles.containerLds}>
      <embed
        src='/lds-star.svg'
        style={{width, height}}
      />
      <p>{loadingText}</p>
    </div>
  );
};

export default LoadingSpinner;

import type { FC } from 'react';
import { useState } from 'react';
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
  const [starHasLoaded, setStarHasLoaded] = useState<boolean>(false);

  return (
    <div className={styles.containerLds}>
      <img
        alt='twinkle star'
        src='/lds-star.svg'
        style={{width, height}}
        onLoad={() => setStarHasLoaded(true)}
      />
      {loadingText
        ? <p>{loadingText}</p>
        : !starHasLoaded ? <p>Loading image...</p> : <></>
      }
    </div>
  );
};

export default LoadingSpinner;

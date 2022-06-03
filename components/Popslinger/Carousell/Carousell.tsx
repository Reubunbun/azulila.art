import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Carousell.module.css';

interface Props {
  imgURLs: string[];
};

const Carousell: FC<Props> = ({ imgURLs }) => {
  const [visibleImages, setVisibleImages] = useState<string[]>(
    imgURLs.slice(0, 7)
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(3);

  const convertToActualIndex = (index: number): number => {
    if (index < 0) {
      return imgURLs.length + index;
    }

    if (index >= imgURLs.length) {
      return index - imgURLs.length;
    }

    return index;
  };

  useEffect(() => {
    setVisibleImages(
        [
            selectedIndex - 3,
            selectedIndex - 2,
            selectedIndex - 1,
            selectedIndex,
            selectedIndex + 1,
            selectedIndex + 2,
            // selectedIndex + 3,
        ]
            .map(convertToActualIndex)
            .map(index => imgURLs[index]),
    );
  }, [selectedIndex, imgURLs]);

  return (
    <div className={styles.carousellContainer}>
      {selectedIndex}
      <button
        onClick={() => setSelectedIndex(prev => {
          if (prev === 0) {
            return imgURLs.length - 1;
          }
          return prev - 1;
        })}
      >
        Left
      </button>
      <div className={styles.imagesContainer}>
        {visibleImages.map((url, i) => (
          <img
            key={url}
            src={url}
            alt={url}
            style={
              (() => {
                switch (i) {
                  case 0:
                    return {
                      zIndex: -3,
                      opacity: 0,
                      transform: 'scale(0)',
                    };
                  case 1:
                    return {
                      zIndex: -2,
                      opacity: 0.6,
                      transform: 'scale(0.9) translateX(-100%)',
                    };
                  case 2:
                    return {
                      zIndex: -1,
                      opacity: 0.8,
                      transform: 'scale(0.95) translateX(-50%)',
                    };
                  case 3:
                    return {
                      zIndex: 0,
                      opacity: 1,
                      transform: 'scale(1) translateX(0%)',
                    };
                  case 4:
                    return {
                      zIndex: -1,
                      opacity: 0.8,
                      transform: 'scale(0.95) translateX(50%)',
                    };
                  case 5:
                    return {
                      zIndex: -2,
                      opacity: 0.6,
                      transform: 'scale(0.9) translateX(100%)',
                    };
                  case 6:
                    return {
                      zIndex: -3,
                      opacity: 0,
                      transform: 'scale(0)',
                    };
                }
              })()

            }
          />
        ))}
      </div>
      <button
        onClick={() => setSelectedIndex(prev => {
          if (prev === imgURLs.length - 1) {
            return 0;
          }
          return prev + 1;
        })}
      >
        Right
      </button>
    </div>
  );
};

export default Carousell;

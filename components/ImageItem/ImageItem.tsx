import type { FC } from 'react';
import type { Image as ImageType } from '../../interfaces';
import { memo, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import LazyLoad from 'react-lazyload';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import styles from './ImageItem.module.css';

interface Props {
  clickImage: (image: ImageType) => void;
  image: ImageType;
};

const ImageItem: FC<Props> = ({clickImage, image}) => {
  const imgAnimation = useAnimation();
  const placeholderAnimation = useAnimation();
  const [hasLoaded, setHasLoaded] = useState(false);

  return (
    <div
      className={styles.containerImageItem}
      style={{height: hasLoaded ? undefined : `${image.height}px`}}
    >
      <LazyLoad>
        <motion.img
          initial={{opacity: 0}}
          animate={imgAnimation}
          exit={{opacity: 0}}
          className={styles.imageItem}
          src={image.url}
          alt={image.description}
          onClick={() => clickImage(image)}
          onLoad={() => {
            imgAnimation.start({
              opacity: 1,
              transition: {
                duration: 0.8,
                type: 'tween',
              },
            });
            placeholderAnimation.start({
              opacity: 0,
              transition: {
                duration: 0.8,
                type: 'tween',
              },
            });
            setHasLoaded(true);
          }}
        />
      </LazyLoad>
      <div className={styles.imageHover} onClick={() => clickImage(image)}>
        <p>{image.title}</p>
      </div>
      {!hasLoaded &&
        <motion.div
          initial={{opacity: 1}}
          animate={placeholderAnimation}
          exit={{opacity: 0}}
          className={styles.placeholder}
        >
          <LoadingSpinner loadingText='' />
        </motion.div>
      }

    </div>
  );
};

export default memo(ImageItem);

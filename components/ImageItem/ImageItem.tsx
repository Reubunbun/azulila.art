import { type FC, type Ref, memo, useState } from 'react';
import type { Image as ImageType } from 'interfaces';
import { motion, useAnimation } from 'framer-motion';
import LazyLoad from 'react-lazyload';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import styles from './ImageItem.module.css';

interface Props {
  clickImage?: (image: ImageType) => void;
  image: ImageType;
  maxHeight?: string;
  onLoad?: () => void;
  imgRef?: Ref<HTMLImageElement>;
  loadingText?: string;
  simpleLoadStyle?: boolean;
};

const ImageItem: FC<Props> = ({
  clickImage,
  onLoad,
  image,
  maxHeight,
  imgRef,
  loadingText,
  simpleLoadStyle,
}) => {
  const imgAnimation = useAnimation();
  const placeholderAnimation = useAnimation();
  const [hasLoaded, setHasLoaded] = useState(false);

  return (
    <div
      className={styles.containerImageItem}
      style={{
        height: hasLoaded
          ? undefined
          : maxHeight
            ? `min(${maxHeight}, ${image.height}px)`
            : `${image.height}px`,
      }}
    >
      <LazyLoad offset={125}>
        <motion.img
          initial={{opacity: 0}}
          animate={imgAnimation}
          exit={{opacity: 0}}
          className={styles.imageItem}
          src={image.url}
          alt={image.description}
          ref={imgRef ? imgRef : undefined}
          onClick={e => {
            e.stopPropagation();
            if (clickImage) {
              clickImage(image);
            }
          }}
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

            if (onLoad) {
              onLoad();
            }
          }}
        />
      </LazyLoad>
      {clickImage &&
        <div className={styles.imageHover} onClick={() => clickImage(image)}>
          <p>{image.title}</p>
        </div>
      }
      {!hasLoaded &&
        <motion.div
          initial={{opacity: 1}}
          animate={placeholderAnimation}
          exit={{opacity: 0}}
          className={`${styles.placeholder} ${simpleLoadStyle ? styles.hideBreathing : ''}`}
        >
          <LoadingSpinner
            loadingText={loadingText || ''}
          />
        </motion.div>
      }
    </div>
  );
};

export default memo(ImageItem);

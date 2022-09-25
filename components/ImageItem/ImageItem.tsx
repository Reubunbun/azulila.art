import { type FC, type RefObject, memo, useState, useLayoutEffect, useRef} from 'react';
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
  imgRef?: RefObject<HTMLImageElement>;
  loadingText?: string;
  simpleLoadStyle?: boolean;
  dontLazyLoad?: boolean;
};

const ImageItem: FC<Props> = ({
  clickImage,
  onLoad,
  image,
  maxHeight,
  imgRef,
  loadingText,
  simpleLoadStyle,
  dontLazyLoad,
}) => {
  const imgAnimation = useAnimation();
  const placeholderAnimation = useAnimation();
  const [hasLoaded, setHasLoaded] = useState(false);
  const localImgRef = useRef<HTMLImageElement>(null);
  const pingAttempts = useRef<number>(0);

  const imgLoadCallback = () => {
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
  };

  useLayoutEffect(() => {
    const intervalId = setInterval(() => {
      if (hasLoaded) {
        clearInterval(intervalId);
        return;
      }

      if (pingAttempts.current >= 10) {
        clearInterval(intervalId);
        return;
      }

      const refToUse = imgRef || localImgRef;

      if (!refToUse?.current) {
        return;
      }

      if (refToUse.current.complete && refToUse.current.naturalHeight !== 0) {
        imgLoadCallback();
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [imgRef, hasLoaded]);

  const imgComponent = <motion.img
    initial={{opacity: 0}}
    animate={imgAnimation}
    exit={{opacity: 0}}
    className={styles.imageItem}
    src={image.url}
    alt={image.description}
    ref={imgRef ? imgRef : localImgRef}
    onClick={e => {
      e.stopPropagation();
      if (clickImage) {
        clickImage(image);
      }
    }}
    onLoad={imgLoadCallback}
  />;

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
      {dontLazyLoad
        ? <>{imgComponent}</>
        : <LazyLoad offset={100}>
            {imgComponent}
          </LazyLoad>
      }
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
          <LoadingSpinner loadingText={loadingText || ''} />
        </motion.div>
      }
    </div>
  );
};

export default memo(ImageItem);

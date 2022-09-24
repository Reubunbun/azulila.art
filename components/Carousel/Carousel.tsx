import type { FC } from 'react';
import { memo, useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Direction } from 'interfaces';
import { useUIContext } from 'context/UIContext';
import CustomAnimatePresence from '../CustomAnimatePresence/CustomAnimatePresence';
import ImageModal from '../ImageModal/ImageModal';
import styles from './Carousel.module.css';

const c_transitionDuration: number = 0.8;
const c_transitionInterval: number = 5500 + (c_transitionDuration * 1000);
const c_imageAnimationOptions = {
  opacity: 1,
  transition: {
    duration: c_transitionDuration,
    type: 'tween',
  },
};

interface Props {
  images: string[];
  maxHeight?: `${number}rem`;
  minHeight?: `${number}rem`;
};

const Carousel: FC<Props> = ({images, maxHeight, minHeight}) => {
  const [imageIndex, setImageIndex] = useState<number>(0);
  const { modalContent, setModalContent } = useUIContext();
  const loadedImages = useRef<{[url: string]: boolean}>({[images[0]]: true});
  const imgTransitionAnimation = useAnimation();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (modalContent) {
        return;
      }

      setImageIndex(
        prev => prev === images.length - 1
          ? 0
          : prev + 1,
      );

    }, c_transitionInterval);

    return () => clearInterval(intervalId);
  }, [modalContent]);

  useEffect(() => {
    if (!loadedImages.current[images[imageIndex]]) {
      return;
    }

    imgTransitionAnimation.start(c_imageAnimationOptions);
  }, [imageIndex]);

  return (
    <div className={styles.containerCarouselImg}>
      <h4>Click the image to view full size!</h4>
      <CustomAnimatePresence exitBeforeEnter>
        <motion.img
          src={images[imageIndex]}
          alt='Carousel Image'
          onLoad={() => {
            imgTransitionAnimation.start(c_imageAnimationOptions);
            loadedImages.current[images[imageIndex]] = true;
          }}
          style={{ maxHeight, minHeight }}
          onClick={() => setModalContent(
            <ImageModal
              image={{
                id: imageIndex,
                url: images[imageIndex],
                width: 0,
                height: 0,
                tags: [],
                priority: 0,
              }}
              close={() => setModalContent(false)}
              getNextImage={(dir, currImage) => {
                if (!currImage) return null;

                const currentIndex = images.findIndex(url => url === currImage?.url);

                if (dir === Direction.Forward) {
                  const nextIndex = currentIndex === images.length - 1
                    ? 0
                    : currentIndex + 1;

                  return {
                    id: nextIndex,
                    url: images[nextIndex],
                    width: 0,
                    height: 0,
                    tags: [],
                    priority: 0,
                  };
                }

                if (dir === Direction.Backward) {
                  const nextIndex = currentIndex === 1
                    ? images.length - 1
                    : currentIndex - 1;

                  return {
                    id: nextIndex,
                    url: images[nextIndex],
                    width: 0,
                    height: 0,
                    tags: [],
                    priority: 0,
                  };
                }

                return null;
              }}
              hideDescriptions={true}
            />
          )}
          key={imageIndex}
          initial={{
            opacity: 0,
          }}
          animate={imgTransitionAnimation}
          exit={{
            opacity: 0,
            transition: {...c_imageAnimationOptions.transition}
          }}
        />
      </CustomAnimatePresence>
    </div>
  );
};

export default memo(Carousel);

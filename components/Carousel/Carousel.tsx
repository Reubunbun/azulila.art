import type { FC } from 'react';
import { useState  } from 'react';
import { Direction } from 'interfaces';
import { useUIContext } from 'context/UIContext';
import ImageModal from '../ImageModal/ImageModal';
import styles from './Carousel.module.css';

interface Props {
  images: string[];
  maxHeight?: `${number}rem`;
  minHeight?: `${number}rem`;
};

const Carousel: FC<Props> = ({images, maxHeight, minHeight}) => {
  const [allImages, setAllImages] = useState(images);
  const { modalContent, setModalContent } = useUIContext();

  return (
    <div className={styles.containerCarouselImg}>
      <h4 className={styles.clickMsg}>Click the image to view full size!</h4>
      {allImages.map(url =>
        <img
          className={modalContent ? styles.modalOpen : ''}
          style={{ maxHeight, minHeight }}
          onAnimationEnd={e => {
            if (e.animationName === styles['fader-in']) {
              return;
            }

            setAllImages(prev => [...prev.slice(1), prev[0]])
          }}
          key={url}
          src={url}
          alt='Carousel Image'
          onClick={() => {
            setModalContent(
              <ImageModal
                image={{
                  id: 123,
                  url: allImages[0],
                  width: 0,
                  height: 0,
                  tags: [],
                  priority: 0,
                }}
                close={() => setModalContent(false)}
                getNextImage={(dir, currImage) => {
                  if (!currImage) return null;

                  const currentIndex = allImages.findIndex(
                    imgUrl => imgUrl === currImage?.url,
                  );

                  if (dir === Direction.Forward) {
                    const nextIndex = currentIndex === allImages.length - 1
                      ? 0
                      : currentIndex + 1;

                    return {
                      id: nextIndex,
                      url: allImages[nextIndex],
                      width: 0,
                      height: 0,
                      tags: [],
                      priority: 0,
                    };
                  }

                  if (dir === Direction.Backward) {
                    const nextIndex = currentIndex === 1
                      ? allImages.length - 1
                      : currentIndex - 1;

                    return {
                      id: nextIndex,
                      url: allImages[nextIndex],
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
            )
          }}
        />
      )}
    </div>
  );
};

export default Carousel;

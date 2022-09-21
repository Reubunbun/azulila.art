import type { FC } from 'react';
import { Image as ImageType, ScreenType } from '../../interfaces';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Direction } from '../../interfaces';
import { useUIContext } from '../../context/UIContext';
import CustomAnimatePresence from '../CustomAnimatePresence/CustomAnimatePresence';
import useScreenType from '../../hooks/useScreenType';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ModalBackdrop from '../ModalBackdrop/ModalBackdrop';
import ImageItem from '../ImageItem/ImageItem';
import styles from './ImageModal.module.css';

interface Props {
  image: ImageType | false;
  close: () => void;
  getNextImage: (dir: Direction, currImage?: ImageType) => ImageType | false | null;
  hideDescriptions?: boolean;
};

const ImageModal: FC<Props> = ({image, close, getNextImage, hideDescriptions}) => {
  const screenType = useScreenType();
  const imgRef = useRef<HTMLImageElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [currImage, setCurrImage] = useState<ImageType | false>(image);
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const { setModalContent } = useUIContext();

  return (
    <ModalBackdrop close={close} key='modal'>
      <motion.div
        onClick={close}
        className={styles.containerImgModal}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
      >
        <button
          onClick={close}
          className={`${styles.modalBtn} ${styles.closeBtn}`}
        >
          <p>X</p>
        </button>
        {currImage &&
          <button
            className={`${styles.modalBtn} ${styles.leftBtn}`}
            onClick={e => {
              e.stopPropagation();
              const nextImg = getNextImage(Direction.Backward, currImage);
              if (nextImg === null) {
                setModalContent(null);
                return;
              }
              setCurrImage(nextImg);
            }}
          >
            <p>&lt;</p>
          </button>
        }
        <CustomAnimatePresence exitBeforeEnter>
          {currImage &&
            <motion.div
              className={styles.containerImg}
              key={currImage.url}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
            >
              {!hideDescriptions &&
                <>
                  <h3 style={{display: screenType !== ScreenType.mobile ? 'none' : undefined}}>
                    {currImage.title}
                  </h3>
                  <div
                    ref={divRef}
                    className={`
                      ${styles.containerDescription}
                      ${screenType === ScreenType.mobile && showDescription ? styles.active : ''}
                    `}
                    onClick={e => {
                      e.stopPropagation();
                      setShowDescription(prev => !prev);
                    }}
                  >
                    <h3 style={{display: screenType === ScreenType.mobile ? 'none' : undefined}}>
                      {currImage.title}
                    </h3>
                    <p>{currImage.description}</p>
                  </div>
                </>
              }
              <ImageItem
                imgRef={imgRef}
                image={currImage}
                onLoad={() => {
                  if (!divRef.current || !imgRef.current) return;

                  if (screenType !== ScreenType.mobile) {
                    divRef.current.style.setProperty('height', null);
                    return;
                  }

                  divRef.current.style.setProperty(
                    'height',
                    `${imgRef.current.offsetHeight}px`,
                  );
                }}
                loadingText='Loading full size image...'
                simpleLoadStyle={true}
              />
            </motion.div>
          }
          {!currImage &&
            <motion.div
              key='loading'
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
            >
              <LoadingSpinner loadingText='Loading more...' />
            </motion.div>
          }
        </CustomAnimatePresence>
        {currImage &&
          <button
            className={`${styles.modalBtn} ${styles.rightBtn}`}
            onClick={e => {
              e.stopPropagation();
              const nextImg = getNextImage(Direction.Forward, currImage);

              if (nextImg === null) {
                setModalContent(null);
                return;
              }
              setCurrImage(nextImg);
            }}
          >
            <p>&gt;</p>
          </button>
        }
      </motion.div>
    </ModalBackdrop>
  );
};

export default ImageModal;

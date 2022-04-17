import type { FC } from 'react';
import { Image as ImageType, ScreenType } from '../../interfaces';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Direction } from '../../interfaces';
import CustomAnimatePresence from '../CustomAnimatePresence/CustomAnimatePresence';
import useScreenType from '../../hooks/useScreenType';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ModalBackdrop from '../ModalBackdrop/ModalBackdrop';
import styles from './ImageModal.module.css';

interface Props {
  image: ImageType | false;
  close: () => void;
  getNextImage: (dir: Direction) => void;
};

const ImageModal: FC<Props> = ({image, close, getNextImage}) => {
  const screenType = useScreenType();
  const imgRef = useRef<HTMLImageElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [showDescription, setShowDescription] = useState<boolean>(false);

  return (
    <ModalBackdrop close={close}>
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
          X
        </button>
        {image &&
          <button
            className={`${styles.modalBtn} ${styles.leftBtn}`}
            onClick={e => {
              e.stopPropagation();
              getNextImage(Direction.Backward);
            }}
          >
            &lt;
          </button>
        }
        <CustomAnimatePresence exitBeforeEnter>
          {image &&
            <motion.div
              className={styles.containerImg}
              key={image.url}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
            >
              <h3 style={{display: screenType !== ScreenType.mobile ? 'none' : undefined}}>
                {image.title}
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
                  {image.title}
                </h3>
                <p>{image.description}</p>
              </div>
              <img
                ref={imgRef}
                src={image.url}
                alt={image.description}
                onClick={e => e.stopPropagation()}
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
              />
            </motion.div>
          }
          {!image &&
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
        {image &&
          <button
            className={`${styles.modalBtn} ${styles.rightBtn}`}
            onClick={e => {
              e.stopPropagation();
              getNextImage(Direction.Forward);
            }}
          >
            &gt;
          </button>
        }
      </motion.div>
    </ModalBackdrop>
  );
};

export default ImageModal;

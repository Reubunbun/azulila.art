import type { FC } from 'react';
import { Image as ImageType, ScreenType } from '../../interfaces';
import { useState } from 'react';
import { motion } from 'framer-motion';
import CustomAnimatePresence from '../CustomAnimatePresence/CustomAnimatePresence';
import useScreenType from '../../hooks/useScreenType';
import ModalBackdrop from '../ModalBackdrop/ModalBackdrop';
import styles from './ImageModal.module.css';


enum Direction {
  Forward,
  Backward,
};

interface Props {
  image: ImageType;
  close: () => void;
  getNextImage?: (dir: Direction) => ImageType;
};

const ImageModal: FC<Props> = ({image, close, getNextImage}) => {
  const screenType = useScreenType();
  const [imageDirection, setImageDirection] = useState<Direction>(Direction.Forward);
  const [showDescription, setShowDescription] = useState<boolean>(false);

  return (
    <ModalBackdrop close={close}>
      <motion.div
        onClick={close}
        className={styles.containerImgModal}
        initial={{scale: 0, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0, opacity: 0}}
      >
        <button
          onClick={close}
          className={`${styles.modalBtn} ${styles.closeBtn}`}
        >
          X
        </button>
        <button
          className={`${styles.modalBtn} ${styles.leftBtn}`}
          onClick={e => {
            e.stopPropagation();
            setImageDirection(Direction.Backward);
            // getNextImage(imageDirection);
          }}
        >
          &lt;
        </button>
        <CustomAnimatePresence exitBeforeEnter custom={imageDirection}>
          <motion.div
            className={styles.containerImg}
            key={image.url}
            custom={imageDirection}
            variants={{
              initial: (dir: Direction) => ({
                x: dir === Direction.Forward ? '100vw' : '-100vw',
                opacity: 0,
              }),
              animate: {
                zIndex: 1,
                x: 0,
                opacity: 1,
              },
              exit: (dir: Direction) => ({
                zIndex: 0,
                x: dir === Direction.Forward ? '-100vw' : '100vw',
                opacity: 0,
              }),
            }}
          >
            <h3>{image.title}</h3>
            <div
              className={`
                ${styles.containerDescription}
                ${screenType === ScreenType.mobile ? styles.active : ''}
              `}
              onClick={e => {
                e.stopPropagation();
                setShowDescription(prev => !prev);
              }}
            >
              <p>{image.description}</p>
            </div>
            <motion.img
              src={image.url}
              alt={image.description}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        </CustomAnimatePresence>
        <button
          className={`${styles.modalBtn} ${styles.rightBtn}`}
          onClick={e => {
            e.stopPropagation();
            setImageDirection(Direction.Forward);
            // getNextImage(imageDirection);
          }}
        >
          &gt;
        </button>
      </motion.div>
    </ModalBackdrop>
  );
};

export default ImageModal;

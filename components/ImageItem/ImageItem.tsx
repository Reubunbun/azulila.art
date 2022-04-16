import { memo } from 'react';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import type { Image as ImageType } from '../../interfaces';
import Image from 'next/image';
import styles from './ImageItem.module.css';

interface Props {
  clickImage: (image: ImageType) => void;
  delay: number;
  image: ImageType;
};

const c_intDelay: number = 0.25;

const ImageItem: FC<Props> = ({clickImage, delay, image}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.4,
        type: 'tween',
        delay: delay * c_intDelay,
      }}
      className={styles.containerImageItem}
    >
      <img
        className={styles.imageItem}
        src={image.url}
        alt={image.description}
        onClick={() => clickImage(image)}
      />
      <div className={styles.imageHover} onClick={() => clickImage(image)}>
        <p>{image.title}</p>
      </div>
    </motion.div>
  );
};

export default memo(ImageItem);

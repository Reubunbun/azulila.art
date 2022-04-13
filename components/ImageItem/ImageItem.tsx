import { memo } from 'react';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import type { Image } from '../../interfaces';
import styles from './ImageItem.module.css';

interface Props {
    clickImage: (image: Image) => void;
    delay: number;
    image: Image;
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
      <motion.img
        whileTap={{scale: 0.98}}
        whileHover={{scale: 1.02}}
        className={styles.imageItem}
        src={image.url}
        alt={image.description}
        onClick={() => clickImage(image)}
      />
    </motion.div>
  );
};

export default memo(ImageItem);

import { memo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import type { FC } from 'react';
import type { Image as ImageType } from '../../interfaces';
import styles from './ImageItem.module.css';

interface Props {
  clickImage: (image: ImageType) => void;
  delay: number;
  image: ImageType;
};

const c_intDelay: number = 0.25;

const ImageItem: FC<Props> = ({clickImage, delay, image}) => {
  const fadeAnimation = useAnimation();

  return (
    <div className={styles.containerImageItem}>
      <motion.img
        initial={{ opacity: 0 }}
        animate={fadeAnimation}
        exit={{opacity: 0}}
        className={styles.imageItem}
        src={image.url}
        alt={image.description}
        onClick={() => clickImage(image)}
        onLoad={() => {
          fadeAnimation.start({
            opacity: 1,
            transition: {
              duration: 0.8,
              type: 'tween',
              delay: delay * c_intDelay,
            }
          });
        }}
      />
      <div className={styles.imageHover} onClick={() => clickImage(image)}>
        <p>{image.title}</p>
      </div>
    </div>
  );
};

export default memo(ImageItem);

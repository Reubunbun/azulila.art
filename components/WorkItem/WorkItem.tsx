import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';
import type { Image } from '../../interfaces';
import ImageItem from '../ImageItem/ImageItem';
import styles from './WorkItem.module.css';

interface Props {
  title: string;
  description: string;
  image: Image;
  linkPath: string;
  isReversed: boolean;
  onLinkClicked: (path: string) => void;
};

const WorkItem: FC<Props> = ({
  title,
  description,
  image,
  linkPath,
  isReversed,
  onLinkClicked,
}) => {
  const containerAnimation = useAnimation();
  const textAnimation = useAnimation();
  const imageAnimation = useAnimation();
  const [computedImgHeight, setComputedImgHeight] = useState<number>(image.height);
  const refContainer = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({threshold: 0.4});

  useEffect(() => {
    if (inView) {
      containerAnimation.start({
        opacity: 1,
        transition: {
          duration: 1,
          type: 'tween',
          delay: .5,
        },
      });

      textAnimation.start({
        x: '0rem',
        transition: {
          duration: 1.5,
          type: 'tween',
        }
      });

      imageAnimation.start({
        x: '0rem',
        transition: {
          duration: 1.5,
          type: 'tween',
        }
      });
    }
  }, [inView]);

  useEffect(() => {
    if (!refContainer.current) {
      return;
    }

    const divWidth = refContainer.current.getBoundingClientRect().width;
    const percentWidthChange = divWidth / image.width;
    setComputedImgHeight(image.height * percentWidthChange);
  }, [typeof window !== 'undefined' ? window.innerWidth : undefined]);

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={containerAnimation}
      exit={{opacity: 0}}
      className={styles.containerWorkItem}
      ref={ref}
    >
      <h3>{title}</h3>
      <div className={styles.containerDescriptionAndImage}>
        <div className={styles.containerDescription}>
          <motion.div
            initial={{x: isReversed ? '-10rem' : '10rem'}}
            animate={textAnimation}
          >
            <p>{description}</p>
            {(linkPath === 'popslinger') &&
              <span
                onClick={() => onLinkClicked(`/work/${linkPath}`)}
                className={styles.link}
              >
                Click here to see more!
              </span>
            }
          </motion.div>
        </div>
        <motion.div
          className={styles.containerImage}
          initial={{x: isReversed ? '10rem' : '-10rem'}}
          animate={imageAnimation}
          ref={refContainer}
        >
          <ImageItem
            image={image}
            maxHeight={`${computedImgHeight}px`}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WorkItem;

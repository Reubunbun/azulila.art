import type { FC } from 'react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';
import styles from './WorkItem.module.css';

interface Props {
  title: string;
  description: string;
  image: string;
  linkPath: string;
  isReversed: boolean;
  onLinkClicked: (path: string) => void;
};

const WorkItem: FC<Props> = ({title, description, image, linkPath, isReversed, onLinkClicked}) => {
  const containerAnimation = useAnimation();
  const textAnimation = useAnimation();
  const imageAnimation = useAnimation();
  const { ref, inView } = useInView();

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
            {/* <span
              onClick={() => onLinkClicked(`/work/${linkPath}`)}
              className={styles.link}
            >
              Click here to see more!
            </span> */}
          </motion.div>
        </div>
        <div className={styles.containerImage}>
          <motion.img
            initial={{x: isReversed ? '10rem' : '-10rem'}}
            animate={imageAnimation}
            src={image}
            alt={`Image for ${title}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default WorkItem;

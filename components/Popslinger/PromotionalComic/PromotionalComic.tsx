import { type FC, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAnimation, motion } from 'framer-motion';
import Carousel from '../../Carousel/Carousel';
import sharedStyles from '../shared.module.css';
import styles from './PromotionalComic.module.css';

const c_comicImages = [
  '/popslinger/comic/1.jpg',
  '/popslinger/comic/2.jpg',
  '/popslinger/comic/3.jpg',
  '/popslinger/comic/4.jpg',
];

const GameAssets: FC = () => {
  const textAnimation = useAnimation();
  const imgAnimation = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      textAnimation.start({
        opacity: 1,
        transition: {
          duration: 1,
        },
      });
      imgAnimation.start({
        opacity: 1,
        transition: {
          duration: 1,
          delay: 0.5,
        },
      });
    }
  }, [inView]);

  return (
    <div
      ref={ref}
      className={`${sharedStyles.textContainer} ${styles.textContainer}`}
    >
      <motion.h3
        className={`${sharedStyles.sectionSubTitle} ${styles.sectionSubTitle}`}
        initial={{opacity: 0}}
        animate={textAnimation}
      >
        Promotional Comic
      </motion.h3>
      <motion.p
        initial={{opacity: 0}}
        animate={textAnimation}
      >
        A promotional comic for the release of the game
      </motion.p>
      <motion.div
        className={styles.carouselContainer}
        initial={{opacity: 0}}
        animate={imgAnimation}
      >
        <Carousel
          images={c_comicImages}
          maxHeight='88.5vh'
        />
      </motion.div>
    </div>
  );
};

export default GameAssets;

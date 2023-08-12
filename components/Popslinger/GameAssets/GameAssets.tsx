import { type FC, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAnimation, motion } from 'framer-motion';
import Carousel from '../../Carousel/Carousel';
import sharedStyles from '../shared.module.css';
import styles from './GameAssets.module.css';

const ASSET_IMAGES = [
  '/popslinger/assets/Hub-Buildings.png',
  '/popslinger/assets/Hub-Buildings2.png',
  '/popslinger/assets/Profiles.png',
  '/popslinger/assets/Props1.png',
  '/popslinger/assets/Props2.png',
];

const GameAssets: FC = () => {
  const textAnimtion = useAnimation();
  const imgAnimation = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      textAnimtion.start({
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
        animate={textAnimtion}
      >
        Game Assets
      </motion.h3>
      <motion.p
        initial={{opacity: 0}}
        animate={textAnimtion}
      >
        Here are a few examples of the various game assets made for the game.
      </motion.p>
      <motion.div
        className={styles.carouselContainer}
        initial={{opacity: 0}}
        animate={imgAnimation}
      >
        <Carousel
          images={ASSET_IMAGES}
          maxHeight='75vh'
        />
      </motion.div>
    </div>
  );
};

export default GameAssets;

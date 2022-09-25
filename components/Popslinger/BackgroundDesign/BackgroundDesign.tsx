import { type FC, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';
import Carousel from '../../Carousel/Carousel';
import sharedStyles from '../shared.module.css';
import styles from './BackgroundDesign.module.css';

const c_backgroundDesignImages = [
  '/popslinger/backgrounds/Beach.png',
  '/popslinger/backgrounds/City.png',
  '/popslinger/backgrounds/Diner-Inside.png',
  '/popslinger/backgrounds/Diner.png',
  '/popslinger/backgrounds/NW.png',
  '/popslinger/backgrounds/Planet.png',
  '/popslinger/backgrounds/Set-District.png',
];

const BackgroundDesign: FC = () => {
  const animation = useAnimation();
  const refCarouselContainer = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({ threshold: 0.8 });

  useEffect(() => {
    if (inView) {
      animation.start({
        x: '0%',
        opacity: 1,
        transition: {
          type: 'tween',
          duration: 0.9,
        },
      }).then(() => {
        if (refCarouselContainer.current) {
          refCarouselContainer.current.classList.add(sharedStyles.overrideTransform);
        }
      });
    }
  }, [inView]);

  return (
    <>
      <h3 className={`${sharedStyles.sectionSubTitle} ${styles.sectionSubTitle}`}>
        Working as a Background Designer in Popslinger
      </h3>
      <div
        ref={ref}
        className={`${sharedStyles.textContainer} ${styles.textWithImageContainer}`}
      >
        <motion.p
          initial={{opacity: 0, x: '-75%'}}
          animate={animation}
        >
          Video games have been one of my biggest artistic inspirations in life; when the opportunity arose to work on one, I was thrilled. Working on it was a different story; there was a lot of effort and deadlines to fulfill.
        </motion.p>
        <motion.div
          initial={{opacity: 0, x: '75%'}}
          animate={animation}
          className={styles.carouselContainer}
          ref={refCarouselContainer}
        >
          <Carousel images={c_backgroundDesignImages} />
        </motion.div>
      </div>
      <motion.div
        initial={{opacity: 0, x: '-75%'}}
        animate={animation}
        className={`${sharedStyles.textContainer} ${styles.textContainer}`}
      >
        <p>
          Background design was something that I wanted to focus in my art career and this game shows my knowledge regarding this area, I learned how to apply it from an animation viewpoint to a video game one, which include background assets, floor tiles, props and more. <br />
          My inspirations while designing these assets included games, artists and musicians like The World Ends With You, Streets of Rage, Hiroshi Nagai and Tatsuro Yamashita.
        </p>
      </motion.div>
    </>
  );
};

export default BackgroundDesign;

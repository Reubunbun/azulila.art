import { type FC, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAnimation, motion } from 'framer-motion';
import Carousel from '../../Carousel/Carousel';
import sharedStyles from '../shared.module.css';
import styles from './ConceptArt.module.css';

const c_conceptImages = [
  '/popslinger/concept-art/Diner-Concept.png',
  '/popslinger/concept-art/Maid-Outfits.png',
  '/popslinger/concept-art/Other-Concept-1.png',
  '/popslinger/concept-art/Other-Concept-2.png',
  '/popslinger/concept-art/PurpleLounge-Concept-1.png',
  '/popslinger/concept-art/PurpleLounge-Concept-2.png',
  '/popslinger/concept-art/PurpleLounge-Concept-3.png',
  '/popslinger/concept-art/RiaSketch.png',
];

const Placeholder: FC = () => {
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
      className={`${sharedStyles.textContainer} ${styles.textWithImageContainer}`}
    >
      <motion.h3
        initial={{opacity: 0}}
        animate={textAnimation}
        className={`${sharedStyles.sectionSubTitle} ${styles.sectionSubTitle}`}
      >
        Concept Art
      </motion.h3>
      <motion.p
        initial={{opacity: 0}}
        animate={textAnimation}
      >
        We went through various different stages for the backgrounds and character design, but we eventually picked the best option after many decisions.
      </motion.p>
      <motion.div
        className={styles.carouselContainer}
        initial={{opacity: 0}}
        animate={imgAnimation}
      >
        <Carousel
          images={c_conceptImages}
          maxHeight='70vh'
        />
      </motion.div>
    </div>
  );
};

export default Placeholder;

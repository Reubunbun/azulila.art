import { FC, useEffect } from 'react';
import { memo, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { animate, motion, useAnimation } from 'framer-motion';
import Carousel from '../../Carousel/Carousel';
import sharedStyles from '../shared.module.css';
import styles from './Placeholder.module.css';

const c_placeholderImages = [
  '/popslinger/concept-art/1.png',
  '/popslinger/concept-art/2.png',
  '/popslinger/concept-art/3.png',
  '/popslinger/concept-art/4.png',
  '/popslinger/concept-art/6.png',
  '/popslinger/concept-art/7.jpg',
  '/popslinger/concept-art/test.png',
];

const Placeholder: FC = () => {
  const slowTextAnimation = useAnimation();
  const fastTextAnimation = useAnimation();
  const imgAnimation = useAnimation();
  const refCarouselContainer = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({ threshold: 0.8 });

  useEffect(() => {
    if (inView) {
      slowTextAnimation.start({
        x: '0%',
        opacity: 1,
        transition: {
          type: 'tween',
          duration: 1.2,
        },
      });
      fastTextAnimation.start({
        x: '0%',
        opacity: 1,
        transition: {
          duration: 1.2,
        },
      });
      imgAnimation.start({
        x: '0%',
        opacity: 1,
        transition: {
          type: 'tween',
          duration: 0.6,
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
      <h3
        className={`${sharedStyles.sectionSubTitle} ${styles.sectionSubTitle}`}
        ref={ref}
      >
        Placeholder text placeholder text
      </h3>
      <motion.div
        className={`${sharedStyles.textContainer} ${styles.textContainer}`}
        initial={{opacity: 0, x: '100%'}}
        animate={fastTextAnimation}
      >
        <p>
          Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text.
        </p>
      </motion.div>
      <div className={`${sharedStyles.textContainer} ${styles.textWithImageContainer}`}>
        <motion.div
          className={styles.carouselContainer}
          initial={{opacity: 0, x: '-100%'}}
          animate={imgAnimation}
        >
          <Carousel
            images={c_placeholderImages}
            randomOrder={false}
          />
        </motion.div>
        <motion.p
          initial={{opacity: 0, x: '100%'}}
          animate={slowTextAnimation}
        >
          Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text.
        </motion.p>
      </div>
      <motion.div
        className={`${sharedStyles.textContainer} ${styles.textContainer}`}
        initial={{opacity: 0, x: '100%'}}
        animate={fastTextAnimation}
      >
        <p>
          Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text. Placeholder text Placeholder text placeholder text Placeholder text placeholder text.
        </p>
      </motion.div>
    </>
  );
};

export default memo(Placeholder);

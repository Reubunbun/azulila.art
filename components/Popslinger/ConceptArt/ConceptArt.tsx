import { type FC, useEffect, memo, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAnimation } from 'framer-motion';
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
      <h3 className={`${sharedStyles.sectionSubTitle} ${styles.sectionSubTitle}`}>
        Concept Art
      </h3>
      <div
        ref={ref}
        className={`${sharedStyles.textContainer} ${styles.textWithImageContainer}`}
      >
        <p>
          We went through various different stages for the backgrounds and character design, but we eventually picked the best option after many decisions.
        </p>
        <div className={styles.carouselContainer}>
          <Carousel
            images={c_conceptImages}
            randomOrder={false}
            maxHeight='42rem'
          />
        </div>
      </div>
    </>
  );
};

export default memo(Placeholder);

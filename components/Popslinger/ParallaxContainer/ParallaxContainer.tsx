import { type FC, type ReactNode, useRef } from 'react';
import { motion, useTransform, useViewportScroll } from 'framer-motion';
import styles from './ParallaxContainer.module.css';

interface Props {
  children: ReactNode;
  imgSrc: string;
  imgAlt: string;
};

type Pixels = `${number}px`;

const PIXELS_TO_MOVE = 130;

const ParallaxContainer: FC<Props> = ({ children, imgSrc, imgAlt }) => {
  const refContainer = useRef<HTMLDivElement>(null);

  const { scrollY } = useViewportScroll();
  const imgYAdjust = useTransform<number, Pixels>(
    scrollY,
    () => {
      if (!refContainer.current) return `${PIXELS_TO_MOVE}px`;

      const screenHeight = window.innerHeight;
      const { top: topOfImage } = refContainer.current?.getBoundingClientRect();
      if (topOfImage > screenHeight) {
        return '0px';
      }

      const percentScrolled = 1 - (topOfImage / screenHeight);
      const distanceToMove = PIXELS_TO_MOVE * percentScrolled;

      return `${distanceToMove}px`;
    }
  );
  const contentYAdjust = useTransform<number, Pixels>(
    scrollY,
    () => {
      if (!refContainer.current) return `${-PIXELS_TO_MOVE}px`;

      const screenHeight = window.innerHeight;
      const { top: topOfImage } = refContainer.current?.getBoundingClientRect();
      if (topOfImage > screenHeight) {
        return '0px';
      }

      const percentScrolled = 1 - (topOfImage / screenHeight);
      const distanceToMove = PIXELS_TO_MOVE * percentScrolled;

      return `${-distanceToMove}px`;
    }
  );

  return (
    <div
      ref={refContainer}
      className={styles.parallaxContainer}
    >
      <motion.img
        src={imgSrc}
        alt={imgAlt}
        style={{
          top: imgYAdjust,
          height: `calc(100% + ${PIXELS_TO_MOVE * 2}px)`,
          transform: `translateY(-${PIXELS_TO_MOVE * 2}px)`,
        }}
      />
      <motion.div
        className={styles.contentContainer}
        style={{
          top: contentYAdjust,
          transform: `translateY(${PIXELS_TO_MOVE / 2}px)`,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxContainer;

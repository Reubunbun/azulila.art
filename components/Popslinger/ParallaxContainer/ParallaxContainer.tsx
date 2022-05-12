import type { FC, ReactNode } from 'react';
import { useRef } from 'react';
import { motion, useTransform, useViewportScroll } from 'framer-motion';
import styles from './ParallaxContainer.module.css';

interface Props {
  children: ReactNode;
  imgSrc: string;
  imgAlt: string;
};

type Pixels = `${number}px`;

const c_pixelsToMove = 100;

const ParallaxContainer: FC<Props> = ({ children, imgSrc, imgAlt }) => {
  const refContainer = useRef<HTMLDivElement>(null);

  const { scrollY } = useViewportScroll();
  const imgYAdjust = useTransform<number, Pixels>(
    scrollY,
    () => {
      if (!refContainer.current) return '0px';

      const screenHeight = window.innerHeight;
      const { top: topOfImage } = refContainer.current?.getBoundingClientRect();
      if (
        topOfImage > screenHeight
      ) {
        return '0px';
      }

      const percentScrolled = 1 - (topOfImage / screenHeight);
      const distanceToMove = c_pixelsToMove * percentScrolled;

      return `${distanceToMove}px`;
    }
  );
  const contentYAdjust = useTransform<number, Pixels>(
    scrollY,
    () => {
      if (!refContainer.current) return '0px';

      const screenHeight = window.innerHeight;
      const { top: topOfImage } = refContainer.current?.getBoundingClientRect();
      if (
        topOfImage > screenHeight
      ) {
        return '0px';
      }

      const percentScrolled = 1 - (topOfImage / screenHeight);
      const distanceToMove = c_pixelsToMove * percentScrolled;

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
          height: `calc(100% + ${c_pixelsToMove * 2}px)`,
          transform: `translateY(-${c_pixelsToMove * 2}px)`,
        }}
        onLoad={e => {
          console.log('hello')
          console.log(e.target);
        }}
      />
      <motion.div
        className={styles.contentContainer}
        style={{
          top: contentYAdjust,
          transform: `translateY(${c_pixelsToMove}px)`,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxContainer;

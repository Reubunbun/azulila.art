import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTransform, useViewportScroll, motion } from 'framer-motion';
import useScreenType from '../../hooks/useScreenType';
import scrollToTop from '../../helpers/smoothScroll';
import styles from './PopslingerNav.module.css';
import { ScreenType } from '../../interfaces';

const c_scrollRange = 400;

const PopslingerNav: FC = () => {
  const router = useRouter();
  const screenType = useScreenType();
  const { scrollY } = useViewportScroll();

  const headerOpacity = useTransform<number, number>(
    scrollY,
    [0, c_scrollRange],
    [1, 0],
  );

  const refHeader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const rootElement = document.querySelector<HTMLElement>(':root');
    if (!rootElement) return;

    const navHeight = getComputedStyle(rootElement)
      .getPropertyValue('--popslinger-header-height');
    rootElement.style.setProperty('--header-height', navHeight);

    const callbackScroll = () => {
      if (!refHeader.current) return;

      if (window.pageYOffset >= (c_scrollRange * 0.8)) {
        refHeader.current.style.pointerEvents = 'none';
        return;
      }
      refHeader.current.style.pointerEvents = 'all';
    };

    document.addEventListener('scroll', callbackScroll);
    () => document.removeEventListener('scroll', callbackScroll);
  }, []);

  return (
    <motion.div
      className={styles.popslingerNavContainer}
      style={
        screenType === ScreenType.mobile
          ? {}
          : {opacity: headerOpacity}
      }
      ref={refHeader}
    >
      <div
        className={styles.backBtn}
        onClick={() => scrollToTop().then(() => router.push('/work'))}
      >
        <p>Go<br/>Back</p>
      </div>
      <h1>Popslinger</h1>
    </motion.div>
  );
};

export default PopslingerNav;

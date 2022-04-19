import type { FC } from 'react';
import dynamic from 'next/dynamic';
import { useState, memo } from 'react';
import { useTransform, useViewportScroll, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Image from 'next/image';
import scrollToTop from '../../helpers/smoothScroll';
import useScreenType from '../../hooks/useScreenType';
import BurgerButton from '../BurgerButton/BurgerButton';
import styles from './NavBar.module.css';
import { ScreenType } from '../../interfaces';

interface Path {
  display: string;
  pathname: string;
  external?: boolean;
};

type Pixels = `${number}px`;
type ViewportHeight = `${number}vh`;
type REM = `${number}rem`;
type HexColour = `#${string}`;

const allPaths: Path[] = [
  {display: 'Work', pathname: '/work'},
  {display: 'Gallery', pathname: '/gallery'},
  {display: 'Popslinger', pathname: '/work/popslinger'},
  {display: 'About', pathname: '/about'},
  {display: 'Commission', pathname: '/commission'},
  {display: 'Contact', pathname: '/contact'},
  {display: 'Shop', pathname: 'https://azulila.bigcartel.com/', external: true},
];

const c_scrollAnimRange: number[] = [0, 200];

const NavBar: FC = () => {
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const screenType = useScreenType();
  const router = useRouter();

  // Scroll animation values
  const { scrollY } = useViewportScroll();
  const titleOpacity = useTransform<number, number>(
    scrollY,
    c_scrollAnimRange,
    [1, 0],
  );
  const navWidth = useTransform<number, Pixels>(
    scrollY,
    yPos => {
      const percentCompletion = Math.min(
        yPos / c_scrollAnimRange[1],
        1
      );

      const vwWidthToShrink = 50;
      const currShrinkAmount = vwWidthToShrink * percentCompletion;
      const newWidth = window.innerWidth * ((100 - currShrinkAmount) / 100);

      return `${Math.max(newWidth, 900)}px`;
    },
  );
  const navTransBottom = useTransform<number, ViewportHeight>(
    scrollY,
    c_scrollAnimRange,
    ['0vh', '-13vh'],
  )
  const logoMaxWidth = useTransform<number, REM>(
    scrollY,
    c_scrollAnimRange,
    ['8rem', '6rem'],
  );
  const logoTransRight = useTransform<number, REM>(
    scrollY,
    c_scrollAnimRange,
    ['0rem', '-14.5rem'],
  );
  // Scroll animation values

  return (
    <nav className={styles.nav}>
      <div className={styles.headerWrapper}>
        <div>
          <motion.div
            className={styles.logoWrapper}
            style={
              screenType === ScreenType.desktop
                ? {
                    minWidth: logoMaxWidth,
                    minHeight: logoMaxWidth,
                    x: logoTransRight,
                  }
                : screenType === ScreenType.smallDesktop
                  ? {opacity: titleOpacity}
                  : {}
            }
          >
            <Image
              src='/favicon.ico'
              alt='Logo for Azulilah'
              layout='fill'

            />
          </motion.div>
          <div className={styles.containerTitleAndSocials}>
            <motion.h1
              style={
                screenType === ScreenType.desktop || screenType === ScreenType.smallDesktop
                  ? {opacity: titleOpacity}
                  : {}
              }
            >
              Azulilah
            </motion.h1>
          </div>
          <BurgerButton onClick={() => {
            const isOpen = !navOpen;
            setNavOpen(isOpen);

            if (typeof document !== 'undefined') {
              const rootElement = document.querySelector<HTMLElement>(':root');
              rootElement?.style.setProperty(
                '--num-links',
                String(allPaths.length),
              );

              if (rootElement && isOpen) {
                const openLinksHeight = getComputedStyle(rootElement)
                  .getPropertyValue('--links-open-height');
                rootElement.style.setProperty('--main-margin-offset', openLinksHeight);
              }
              if (rootElement && !isOpen) {
                rootElement.style.setProperty('--main-margin-offset', '0rem');
              }
            }
          }} />
        </div>
      </div>
      <motion.ul
        className={`${styles.linksList} ${navOpen ? styles.openLinksList : ''}`}
        style={
          screenType === ScreenType.desktop || screenType === ScreenType.smallDesktop
            ? {
                y: navTransBottom,
                width: navWidth,
              }
            : {}
        }
      >
        {allPaths.map((path: Path) => (
          <li key={path.pathname}>
            <div
              className={styles.linkItem}
              onClick={() => {
                if (path.external) {
                  window.open(path.pathname, '_blank')?.focus();
                  return;
                }
                scrollToTop().then(() => router.push(path.pathname));
              }}
            >
              <motion.p
                className={router.pathname === path.pathname ? styles.linkSelected : ''}
              >
                {path.display}
              </motion.p>
              {path.external && <embed src='/external.svg' />}
              {router.pathname === path.pathname &&
                <motion.div
                  transition={{
                    duration: 0.8,
                    ease: 'easeInOut',
                  }}
                  className={styles.linkUnderline}
                  layoutId='underline'
                />
              }
            </div>
          </li>
        ))}
      </motion.ul>
    </nav>
  );
};

export default dynamic(
  () => Promise.resolve(memo(NavBar)),
  {
    ssr: false,
  },
);

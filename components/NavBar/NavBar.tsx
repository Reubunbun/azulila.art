import type { FC } from 'react';
import dynamic from 'next/dynamic';
import { useState, memo } from 'react';
import { useTransform, useViewportScroll, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { ScreenType } from '../../interfaces';
import { useCommissionContext } from '../../context/CommissionContext';
import scrollToTop from '../../helpers/smoothScroll';
import useScreenType from '../../hooks/useScreenType';
import BurgerButton from '../BurgerButton/BurgerButton';
import styles from './NavBar.module.css';

interface Props {
  dontStick: boolean;
};

interface Path {
  display: string;
  pathname: string;
  external?: boolean;
};

type Pixels = `${number}px`;
type ViewportHeight = `${number}vh`;
type REM = `${number}rem`;

const allPaths: Path[] = [
  {display: 'Work', pathname: '/work'},
  // {display: 'Popslinger', pathname: '/work/popslinger'},
  {display: 'Gallery', pathname: '/gallery'},
  {display: 'About', pathname: '/about'},
  {display: 'Commission', pathname: '/commission'},
  {display: 'Contact', pathname: '/contact'},
  {display: 'Shop', pathname: 'https://azulila.bigcartel.com/', external: true},
];

const c_comparePath = (currUrl: string, pathname: string) : boolean => (
  currUrl === '/work/popslinger'
    ? pathname === '/work/popslinger'
    : currUrl.startsWith(pathname)
);

const c_desktopSizes = [ScreenType.desktop, ScreenType.large, ScreenType.extraLarge];
const c_scrollAnimRange: number[] = [0, 200];

const NavBar: FC<Props> = ({dontStick}) => {
  const screenType = useScreenType();
  const router = useRouter();
  const dontAnimate = (
    screenType !== ScreenType.mobile &&
    dontStick
  );
  const [navOpen, setNavOpen] = useState<boolean>(false);

  const { pageProgress: lastCommissionPath } = useCommissionContext();

  // Scroll animation values
  const { scrollY } = useViewportScroll();
  const titleOpacity = useTransform<number, number>(
    scrollY,
    c_scrollAnimRange,
    [1, 0],
  );
  const textShadowOpacity = useTransform<number, number>(
    scrollY,
    c_scrollAnimRange,
    [0, 1],
  );
  const navWidth = useTransform<number, Pixels>(
    scrollY,
    yPos => {
      const percentCompletion = Math.min(
        yPos / c_scrollAnimRange[1],
        1
      )

      const vwWidthToShrink = 50;
      const currShrinkAmount = vwWidthToShrink * percentCompletion;
      const newWidth = window.innerWidth * ((100 - currShrinkAmount) / 100);

      return `${Math.max(newWidth, 900)}px`;
    },
  );
  const navHeight = useTransform<number, ViewportHeight>(
    scrollY,
    c_scrollAnimRange,
    [
      '20vh',
      screenType === ScreenType.large
        ? '14vh'
        : '12.5vh',
    ],
  );
  const navTransBottom = useTransform<number, ViewportHeight>(
    scrollY,
    c_scrollAnimRange,
    [
      '0vh',
      screenType === ScreenType.extraLarge
        ? '-8vh'
        : screenType === ScreenType.large
            ? '-9vh'
            : '-16vh',
    ],
  )
  const logoMaxWidth = useTransform<number, REM>(
    scrollY,
    c_scrollAnimRange,
    [
      screenType === ScreenType.extraLarge
        ? '18rem'
        : screenType === ScreenType.large
            ? '13rem'
            : '9rem',
      screenType === ScreenType.extraLarge
        ? '11rem'
        : screenType === ScreenType.large
            ? '8rem'
            : '6rem',
    ],
  );
  const logoMaxWidthMob = useTransform<number, REM>(
    scrollY,
    c_scrollAnimRange,
    ['6rem', '4rem'],
  );
  const logoTransRight = useTransform<number, REM>(
    scrollY,
    c_scrollAnimRange,
    [
      '0rem',
      screenType === ScreenType.extraLarge
        ? '-20rem'
        : screenType === ScreenType.large
            ? '-16rem'
            : '-14.5rem',
    ],
  );
  const logoTransUp = useTransform<number, REM>(
    scrollY,
    c_scrollAnimRange,
    [
      '0rem',
      screenType === ScreenType.large || screenType === ScreenType.extraLarge
        ? '0rem'
        : '-1.75rem',
    ],
  );
  // Scroll animation values

  return (
    <motion.nav
      className={`${styles.nav} ${dontAnimate ? styles.dontStick : ''}`}
      style={
        !dontAnimate && (screenType !== ScreenType.desktop)
          ? {'--header-height': navHeight}
          : {}
      }
    >
      <div className={styles.headerWrapper}>
        <div>
          <motion.div
            className={styles.logoWrapper}
            style={
              dontAnimate
                ? {}
                : c_desktopSizes.includes(screenType)
                    ? {
                        minWidth: logoMaxWidth,
                        minHeight: logoMaxWidth,
                        x: logoTransRight,
                        y: logoTransUp,
                      }
                    : screenType === ScreenType.tablet
                      ? {opacity: titleOpacity}
                      : {minWidth: logoMaxWidthMob, minHeight: logoMaxWidthMob}

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
                !dontAnimate && c_desktopSizes.includes(screenType)
                  ? {opacity: titleOpacity}
                  : {}
              }
            >
              Azulila
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
          !dontAnimate && c_desktopSizes.includes(screenType)
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

                if (path.pathname === '/commission') {
                  if (!lastCommissionPath) {
                    scrollToTop().then(() => router.push(path.pathname));
                    return;
                  }
                  scrollToTop().then(() => router.push(lastCommissionPath));
                  return;
                }

                scrollToTop().then(() => router.push(path.pathname));
              }}
            >
              <motion.p
                className={c_comparePath(router.pathname, path.pathname) ? styles.linkSelected : ''}
                style={
                  !dontAnimate && c_desktopSizes.includes(screenType)
                    ? {'--link-opacity': textShadowOpacity}
                    : {}
                }
              >
                {path.display}
              </motion.p>
              {c_comparePath(router.pathname, path.pathname) &&
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
    </motion.nav>
  );
};

export default dynamic(
  () => Promise.resolve(memo(NavBar)),
  {
    ssr: false,
  },
);

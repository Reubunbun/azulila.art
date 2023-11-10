import { type FC, useEffect, memo } from 'react';
import { useTransform, useViewportScroll, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ScreenType } from 'interfaces';
import { useCommissionContext } from 'context/CommissionContext';
import { useUIContext } from 'context/UIContext';
import scrollToTop from 'helpers/smoothScroll';
import useScreenType from 'hooks/useScreenType';
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

const ALL_PATHS: Path[] = [
  {display: 'Work', pathname: '/work'},
  {display: 'Popslinger', pathname: '/work/popslinger'},
  {display: 'Gallery', pathname: '/gallery'},
  {display: 'About', pathname: '/about'},
  {display: 'Commission', pathname: '/commission'},
  {display: 'Contact', pathname: '/contact'},
  {display: 'Shop', pathname: '/shop'},
];

const comparePath = (currUrl: string, pathname: string) : boolean => (
  currUrl === '/work/popslinger'
    ? pathname === '/work/popslinger'
    : currUrl.startsWith(pathname)
);

const DESKTOP_SIZES = [ScreenType.desktop, ScreenType.large, ScreenType.extraLarge];
const SCROLL_ANIM_RANGE: number[] = [0, 200];

const NavBar: FC<Props> = ({dontStick}) => {
  const screenType = useScreenType();
  const router = useRouter();
  const dontAnimate = (
    screenType !== ScreenType.mobile &&
    dontStick
  );

  const { pageProgress: lastCommissionPath } = useCommissionContext();
  const { navOpen, setNavOpen, setAlertContent } = useUIContext();

  // Scroll animation values
  const { scrollY } = useViewportScroll();
  const titleOpacity = useTransform<number, number>(
    scrollY,
    SCROLL_ANIM_RANGE,
    [1, 0],
  );
  const textShadowOpacity = useTransform<number, number>(
    scrollY,
    SCROLL_ANIM_RANGE,
    [0, 0.7],
  );
  const navWidth = useTransform<number, Pixels>(
    scrollY,
    yPos => {
      const percentCompletion = Math.min(
        yPos / SCROLL_ANIM_RANGE[1],
        1
      )

      const vwWidthToShrink = 50;
      const currShrinkAmount = vwWidthToShrink * percentCompletion;
      const newWidth = window.innerWidth * ((100 - currShrinkAmount) / 100);

      const minWidth = screenType === ScreenType.extraLarge
        ? 1800
        : screenType === ScreenType.large
            ? 1600
            : 900;
      return `${Math.max(newWidth, minWidth)}px`;
    },
  );
  const navHeight = useTransform<number, ViewportHeight>(
    scrollY,
    SCROLL_ANIM_RANGE,
    [
      '20vh',
      screenType === ScreenType.large
        ? '14vh'
        : '12.5vh',
    ],
  );
  const navTransBottom = useTransform<number, ViewportHeight>(
    scrollY,
    SCROLL_ANIM_RANGE,
    [
      '0vh',
      screenType === ScreenType.extraLarge
        ? '-8vh'
        : screenType === ScreenType.large
            ? '-9.7vh'
            : '-16vh',
    ],
  )
  const logoMaxWidth = useTransform<number, REM>(
    scrollY,
    SCROLL_ANIM_RANGE,
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
    SCROLL_ANIM_RANGE,
    ['6rem', '4rem'],
  );
  const logoTransRight = useTransform<number, REM>(
    scrollY,
    SCROLL_ANIM_RANGE,
    [
      '0rem',
      screenType === ScreenType.extraLarge
        ? '-20rem'
        : screenType === ScreenType.large
            ? '-26rem'
            : '-15rem',
    ],
  );
  const logoTransUp = useTransform<number, REM>(
    scrollY,
    SCROLL_ANIM_RANGE,
    [
      '0rem',
      screenType === ScreenType.large || screenType === ScreenType.extraLarge
        ? '0rem'
        : '-1.75rem',
    ],
  );
  // Scroll animation values

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const rootElement = document.querySelector<HTMLElement>(':root');

      if (!rootElement) return;

      rootElement.style.setProperty('--main-margin-top', 'var(--default-main-margin-top)');

      const navHeight = getComputedStyle(rootElement)
        .getPropertyValue('--main-header-height');
      rootElement.style.setProperty('--header-height', navHeight);
    }
  }, []);

  useEffect(() => {
    setAlertContent(null);
  });

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const rootElement = document.querySelector<HTMLElement>(':root');
    rootElement?.style.setProperty(
      '--num-links',
      String(ALL_PATHS.length),
    );

    if (rootElement && navOpen) {
      const openLinksHeight = getComputedStyle(rootElement)
        .getPropertyValue('--links-open-height');
      rootElement.style.setProperty('--main-margin-offset', openLinksHeight);
    }
    if (rootElement && !navOpen) {
      rootElement.style.setProperty('--main-margin-offset', '0rem');
    }
  }, [navOpen]);

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
                : DESKTOP_SIZES.includes(screenType)
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
                !dontAnimate && DESKTOP_SIZES.includes(screenType)
                  ? {opacity: titleOpacity}
                  : {}
              }
            >
              Azulilah
            </motion.h1>
          </div>
          <BurgerButton
            onClick={() => setNavOpen(prev => !prev)}
            isOpen={navOpen}
          />
        </div>
      </div>
      <motion.ul
        className={`${styles.linksList} ${navOpen ? styles.openLinksList : ''}`}
        style={
          !dontAnimate && DESKTOP_SIZES.includes(screenType)
            ? {
                y: navTransBottom,
                width: navWidth,
              }
            : {}
        }
      >
        {ALL_PATHS.map((path: Path) => (
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

                if (path.pathname === '/work/popslinger') {
                  setNavOpen(false);
                }

                scrollToTop().then(() => router.push(path.pathname));
              }}
            >
              <motion.p
                unselectable='on'
                className={comparePath(router.pathname, path.pathname) ? styles.linkSelected : ''}
                style={
                  !dontAnimate && DESKTOP_SIZES.includes(screenType)
                    ? {'--link-opacity': textShadowOpacity}
                    : {}
                }
              >
                {path.display}
              </motion.p>
              {comparePath(router.pathname, path.pathname) &&
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

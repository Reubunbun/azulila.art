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
};

type ViewportWidth = `${number}vw`;
type ViewportHeight = `${number}vh`;
type REM = `${number}rem`;
type HexColour = `#${string}`;

const allPaths: Path[] = [
  {display: 'Work', pathname: '/work'},
  {display: 'Gallery', pathname: '/gallery'},
  {display: 'About', pathname: '/about'},
  {display: 'Contact', pathname: '/contact'},
  {display: 'FAQ', pathname: '/FAQ'},
  {display: 'Commission', pathname: '/commission'},
];

const c_twitterLink: string = 'https://twitter.com/azulilah';
const c_instaLink: string = 'https://www.instagram.com/azulilah';
const c_tumblrLink: string = 'https://azulila.tumblr.com';

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
  const navPadding = useTransform<number, ViewportWidth>(
    scrollY,
    c_scrollAnimRange,
    screenType === ScreenType.desktop
      ? ['0vw', '30vw']
      : ['0vw', '20vw'],
  );
  const navTransBottom = useTransform<number, ViewportHeight>(
    scrollY,
    c_scrollAnimRange,
    ['0vh', '-12.5vh'],
  )
  const logoMaxWidth = useTransform<number, REM>(
    scrollY,
    c_scrollAnimRange,
    ['8rem', '6rem'],
  );
  const logoTransRight = useTransform<number, REM>(
    scrollY,
    c_scrollAnimRange,
    ['0rem', '-8rem'],
  );
  const socialsTransLeft = useTransform<number, REM>(
    scrollY,
    c_scrollAnimRange,
    ['0rem', '8rem'],
  );
  const linksColour = useTransform<number, HexColour>(
    scrollY,
    c_scrollAnimRange,
    ['#783c55', '#ffabfb'],
  );
  const underlineColour = useTransform<number, HexColour>(
    scrollY,
    c_scrollAnimRange,
    ['#f33d86', '#783c55'],
  );
  // Scroll animation values

  return (
    <nav className={styles.nav}>
      <div className={styles.headerWrapper}>
        <div>
          <motion.div
            className={styles.logoWrapper}
            style={
              screenType === ScreenType.desktop || screenType === ScreenType.smallDesktop
                ? {
                    maxWidth: logoMaxWidth,
                    maxHeight: logoMaxWidth,
                    x: logoTransRight,
                  }
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
            <motion.div
              className={styles.containerSocials}
              style={
                screenType === ScreenType.desktop || screenType === ScreenType.smallDesktop
                  ? {x: socialsTransLeft}
                  : {}
              }
            >
              <a href={c_twitterLink} target='_blank' rel='noreferrer'>
                <embed src='/social-twitter.svg' />
              </a>
              <div className={styles.desktopSocials}>
                <a href={c_instaLink} target='_blank' rel='noreferrer'>
                  <embed src='/social-insta.svg' />
                </a>
                <a href={c_tumblrLink} target='_blank' rel='noreferrer'>
                  <embed src='/social-tumblr.svg' />
                </a>
              </div>
              <a href={c_instaLink} target='_blank' rel='noreferrer'>
                <embed src='/social-insta.svg' className={styles.mobInsta} />
              </a>
              <a href={c_tumblrLink} target='_blank' rel='noreferrer'>
                <embed src='/social-tumblr.svg' className={styles.mobTumblr} />
              </a>
            </motion.div>
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
                paddingLeft: navPadding,
                paddingRight: navPadding,
              }
            : {}
        }
      >
        {allPaths.map((path: Path) => (
          <li
            key={path.pathname}
            className={router.pathname === path.pathname ? styles.linkSelected : ''}
          >
            <div
              className={styles.linkItem}
              onClick={() => {
                scrollToTop().then(() => router.push(path.pathname));
              }}
            >
              <motion.p
                style={
                  screenType === ScreenType.desktop || screenType === ScreenType.smallDesktop
                    ? {color: linksColour}
                    : {}
                }
              >
                {path.display}
              </motion.p>
              {router.pathname === path.pathname &&
                <motion.div
                  transition={{
                    duration: 0.8,
                    ease: 'easeInOut',
                  }}
                  className={styles.linkUnderline}
                  layoutId='underline'
                  style={
                    screenType === ScreenType.desktop || screenType === ScreenType.smallDesktop
                      ? {color: underlineColour}
                      : {}
                  }
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

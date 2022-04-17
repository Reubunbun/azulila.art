import type { FC } from 'react';
import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import BurgerButton from '../BurgerButton/BurgerButton';
import styles from './NavBar.module.css';

interface Path {
  display: string;
  pathname: string;
};

const allPaths: Path[] = [
  {display: 'Work', pathname: '/work'},
  {display: 'Gallery', pathname: '/gallery'},
  {display: 'About', pathname: '/about'},
  {display: 'Contact', pathname: '/contact'},
  {display: 'FAQ', pathname: '/FAQ'},
  {display: 'Commission', pathname: '/commission'},
];

const c_twitterLink = 'https://twitter.com/azulilah';
const c_instaLink = 'https://www.instagram.com/azulilah';
const c_tumblrLink = 'https://azulila.tumblr.com';

const NavBar: FC = () => {
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const router = useRouter();

  return (
    <nav className={styles.nav}>
      <div className={styles.headerWrapper}>
        <div>
          <div className={styles.logoWrapper}>
            <Image
              src='/favicon.ico'
              alt='Logo for Azulilah'
              layout='fill'
            />
          </div>
          <div className={styles.containerTitleAndSocials}>
            <h1>Azulilah</h1>
            <div className={styles.containerSocials}>
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
            </div>
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
      <ul className={`${styles.linksList} ${navOpen ? styles.openLinksList : ''}`}>
        {allPaths.map((path: Path) => (
          <li
            key={path.pathname}
            className={router.pathname === path.pathname ? styles.linkSelected : ''}
          >
            <Link href={path.pathname} passHref>
              <div className={styles.linkItem}>
                <p>{path.display}</p>
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
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default memo(NavBar);

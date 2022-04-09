import { useContext, memo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import AppStateContext from '../../context/AppStateProvider';
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
];

const NavBar = () => {
  const {navOpen, setNavOpen} = useContext(AppStateContext);
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
          <h1>Azulilah</h1>
          <BurgerButton onClick={() => setNavOpen(!navOpen)} />
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

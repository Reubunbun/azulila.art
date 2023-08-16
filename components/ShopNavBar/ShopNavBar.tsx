import { type FC, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useScreenType from 'hooks/useScreenType';
import styles from './ShopNavBar.module.css';
import { ScreenType } from 'interfaces';

interface Path {
  display: string;
  pathname: string;
};

const ALL_PATHS: Path[] = [
  { display: 'Back To Main Site', pathname: '/work' },
  { display: 'Products', pathname: '/shop' },
  { display: 'Basket', pathname: '/shop/basket' },
];

const ShopNavBar: FC = () => {
  const router = useRouter();
  const screenType = useScreenType();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const rootElement = document.querySelector<HTMLElement>(':root');
    if (!rootElement) return;

    if (screenType === ScreenType.mobile) {
      const shopNavHeight = getComputedStyle(rootElement)
        .getPropertyValue('--shop-header-height-mob');
      rootElement.style.setProperty('--header-height', shopNavHeight);
      rootElement.style.setProperty('--num-links', '0');
      rootElement.style.setProperty('--main-margin-offset', '0.1rem');
    } else {
      const shopNavHeight = getComputedStyle(rootElement)
        .getPropertyValue('--shop-header-height');
      rootElement.style.setProperty('--header-height', shopNavHeight);
    }
  }, []);

  return (
    <nav className={styles.nav}>
      <div className={styles.content}>
        <div className={styles.headerWrapper}>
          <h1>Azulilah Shop</h1>
        </div>
        <motion.ul
          className={styles.linksList}
        >
          {ALL_PATHS.map(({ pathname, display }) =>
            <li key={pathname}>
              <div
                className={styles.linkItem}
                onClick={() => router.push(pathname)}
              >
                <p
                  unselectable='on'
                  className={router.pathname === pathname ? styles.linkSelected : ''}
                >
                  {display}
                </p>
                {router.pathname === pathname &&
                  <motion.div
                    transition={{
                      duration: 0.8,
                      ease: 'easeInOut'
                    }}
                    className={styles.linkUnderline}
                    layoutId='underline'
                  />
                }
              </div>
            </li>
          )}
        </motion.ul>
      </div>
    </nav>
  );
};

export default dynamic(
  () => Promise.resolve(memo(ShopNavBar)),
  {
    ssr: false,
  }
);

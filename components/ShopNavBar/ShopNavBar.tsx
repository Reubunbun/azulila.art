import { type FC, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useScreenType from 'hooks/useScreenType';
import { useShopContext } from 'context/ShopContext';
import styles from './ShopNavBar.module.css';
import { ScreenType } from 'interfaces';

interface Path {
  display: string;
  pathname: string;
  highlightPaths: Array<string>;
};

const BASKET_PATH = '/shop/basket';

const ALL_PATHS: Path[] = [
  {
    display: 'Back To Main Site',
    pathname: '/work',
    highlightPaths: [],
  },
  {
    display: 'Products',
    pathname: '/shop',
    highlightPaths: ['/shop'],
  },
  {
    display: 'Basket',
    pathname: BASKET_PATH,
    highlightPaths: [BASKET_PATH, `${BASKET_PATH}/checkout`],
  },
];

const ShopNavBar: FC = () => {
  const router = useRouter();
  const screenType = useScreenType();
  const navRef = useRef<HTMLDivElement>(null);
  const { selectedProducts } = useShopContext();
  const numInBasket = Object.keys(selectedProducts).length;
  const refBasketLink = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    console.log('in ue');

    const cb = () => {
      const rootElement = document.querySelector<HTMLElement>(':root');
      if (!rootElement) return;

      if (!navRef.current) return;

      if (window.innerWidth < 1024) {
        rootElement.style.setProperty('--main-margin-top', '0rem');
        rootElement.style.setProperty('--header-height', '0px');
        rootElement.style.setProperty('--num-links', '0');
        rootElement.style.setProperty(
          '--main-margin-offset',
          `${navRef.current.getBoundingClientRect().height}px`,
        );
      } else if (window.innerWidth < 1650) {
        rootElement.style.setProperty('--main-margin-top', '5rem');
        const shopNavHeight = getComputedStyle(rootElement)
          .getPropertyValue('--shop-header-height');
        rootElement.style.setProperty('--header-height', shopNavHeight);
      } else {
        rootElement.style.setProperty('--main-margin-top', '1rem');
        const shopNavHeight = getComputedStyle(rootElement)
          .getPropertyValue('--shop-header-height');
        rootElement.style.setProperty('--header-height', shopNavHeight);
      }
    };

    cb();

    window.addEventListener('resize', cb);
    return () => {
      window.removeEventListener('resize', cb)
    };
  }, []);

  useEffect(() => {
    if (!refBasketLink.current || numInBasket === 0) return;

    refBasketLink.current.classList.remove(styles.basketUpdate);
    void refBasketLink.current.offsetWidth;
    refBasketLink.current.classList.add(styles.basketUpdate);

  }, [numInBasket]);

  return (
    <nav className={styles.nav}>
      <div ref={navRef} className={styles.content}>
        <div className={styles.headerWrapper}>
          <h1>Azulilah Shop</h1>
        </div>
        <motion.ul className={styles.linksList}>
          {ALL_PATHS.map(({ pathname, display, highlightPaths }) =>
            <li key={pathname}>
              <div
                className={styles.linkItem}
                onClick={() => router.push(pathname)}
              >
                <p
                  unselectable='on'
                  className={router.pathname === pathname ? styles.linkSelected : ''}
                  ref={pathname === BASKET_PATH ? refBasketLink : null}
                >
                  {`${display} ${
                    pathname === BASKET_PATH && numInBasket
                      ? `(${numInBasket})`
                      : ''
                  }`}
                </p>
                {highlightPaths.includes(router.pathname) &&
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

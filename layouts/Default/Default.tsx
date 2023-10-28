import { type ReactNode, type FC, useState, useEffect, useRef, Fragment } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Head from 'next/head';
import CloseIcon from '@mui/icons-material/Close';
import { useUIContext } from 'context/UIContext';
import NavBar from 'components/NavBar/NavBar';
import ShopNavBar from 'components/ShopNavBar/ShopNavBar';
import CustomAnimatePresence from 'components/CustomAnimatePresence/CustomAnimatePresence';
import styles from './Default.module.css';

interface Props {
  children: ReactNode;
  title: string;
  description: string;
  transitionTime: number;
  dontStickHeader: boolean;
  removeMainPadding: boolean;
  removeMainMargin: boolean;
  removeMainBackground: boolean;
  background?: string;
  noNav?: boolean;
};

const CLASS_FADE_IN = 'fadeIn';
const CLASS_FADE_OUT = 'fadeOut';

const TWITTER_LINK = 'https://twitter.com/azulilah';
const INSTA_LINK = 'https://www.instagram.com/azulilah';
const TUMBLR_LINK = 'https://azulila.tumblr.com';
const YOUTUBE_LINK = 'https://youtube.com/channel/UCk1dOImMqTegvSGg1pGhp_w';

const DefaultLayout: FC<Props> = ({
  children,
  title,
  description,
  transitionTime,
  dontStickHeader,
  removeMainPadding,
  removeMainMargin,
  removeMainBackground,
  background,
  noNav,
}) => {
  const router = useRouter();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [mainTransitionStage, setMainTransitionStage] = useState(CLASS_FADE_OUT);
  const { modalContent, navOpen, setNavOpen, alertContent, setAlertContent } = useUIContext();
  const lastScrollPos = useRef<number>(0);

  useEffect(() => {
    setMainTransitionStage(CLASS_FADE_IN);
  }, []);

  useEffect(() => {
    if (children !== displayChildren) {
      setMainTransitionStage(CLASS_FADE_OUT);
    }
  }, [children, setDisplayChildren, displayChildren]);

  useEffect(() => {
    const elHTML = document.querySelector('html');
    if (!elHTML) {
      return;
    }

    if (modalContent) {
      elHTML.style.overflowY = 'hidden';
    } else {
      elHTML.style.overflowY = 'scroll';
    }
  }, [modalContent]);

  useEffect(() => {
    if (
      typeof document === 'undefined' ||
      !navOpen
    ) {
      return;
    }

    const scrollCallback = () => {
      const currScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (currScrollTop > lastScrollPos.current) {
        setNavOpen(false);
      }
      lastScrollPos.current = currScrollTop <= 0 ? 0 : currScrollTop;
    };

    document.addEventListener('scroll', scrollCallback);
    return () => document.removeEventListener('scroll', scrollCallback);
  }, [navOpen]);

  return (
    <>
      <Head>
        <title>{`Azulilah | ${title}`}</title>
        <meta
          name="description"
          content={description}
        />
        <meta
          name="keywords"
          content="Azulila, Azulilah, Art, Commission, Popslinger, Tania Reyes"
        />
      </Head>
      <CustomAnimatePresence exitBeforeEnter>
        <motion.div
          key={background || 'none'}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: transitionTime}}
          className={styles.backgroundImg}
          style={{
            backgroundImage: background
              ? `url('/${background}')`
              : 'url("/backgrounds/main-bg.gif")'
          }}
        />
      </CustomAnimatePresence>
      <div className={styles.pageContent}>
        <CustomAnimatePresence exitBeforeEnter>
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: transitionTime}}
            key={noNav ? 'NoNav' : 'DefaultNav'}
          >
            {noNav
              ? <></>
              : router.pathname.startsWith('/secret-shop')
                  ? <ShopNavBar />
                  : <NavBar dontStick={dontStickHeader} />
            }
          </motion.div>
        </CustomAnimatePresence>

        <main
          className={`${
              dontStickHeader ? styles.dontStick : ''
            } ${
              removeMainPadding ? styles.removePadding : ''
            } ${
              removeMainBackground ? styles.removeBg : ''
            } ${
              removeMainMargin ? styles.removeMargin : ''
            }`
          }
          onClick={() => {
            if (navOpen) {
              setNavOpen(false);
            }
          }}
        >
          <div
            onTransitionEnd={() => {
              if (mainTransitionStage === CLASS_FADE_OUT) {
                setDisplayChildren(children);
                setMainTransitionStage(CLASS_FADE_IN);
              }
            }}
            className={`${styles.transitionContainer} ${styles[mainTransitionStage]}`}
          >
            <CustomAnimatePresence>
              {alertContent &&
                <motion.div
                  className={styles.alertContainer}
                  initial={{opacity: 1}}
                  exit={{opacity: 0}}
                >
                  {alertContent}
                  <div
                    className={styles.closeBtn}
                    onClick={() =>  setAlertContent(null)}
                  >
                    <CloseIcon color='inherit' />
                  </div>
                </motion.div>
              }
            </CustomAnimatePresence>

            <div className={styles.actualContent}>
              {displayChildren}
            </div>
          </div>
        </main>
      </div>
      <footer
        className={styles.footer}
        onClick={() => {
          if (navOpen) {
            setNavOpen(false);
          }
        }}
      >
        <div className={styles.containerSocials}>
          <a href={TWITTER_LINK} target='_blank' rel='noreferrer'>
            <embed src='/icons/social-twitter.svg' />
          </a>
          <a href={INSTA_LINK} target='_blank' rel='noreferrer'>
            <embed src='/icons/social-insta.svg' />
          </a>
          <a href={TUMBLR_LINK} target='_blank' rel='noreferrer'>
            <embed src='/icons/social-tumblr.svg' />
          </a>
          <a href={YOUTUBE_LINK} target='_blank' rel='noreferrer'>
            <embed src='/icons/social-youtube.svg' />
          </a>
        </div>
        <p>
          <b>This website was created by Reuben Price - reuben.luke.p@gmail.com</b>
        </p>
      </footer>
      <CustomAnimatePresence >
        {modalContent || <Fragment key='empty'></Fragment>}
      </CustomAnimatePresence>
    </>
  );
};

export default DefaultLayout;

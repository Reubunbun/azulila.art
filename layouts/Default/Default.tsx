import type { ReactNode, FC } from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import NavBar from '../../components/NavBar/NavBar';
import CustomAnimatePresence from '../../components/CustomAnimatePresence/CustomAnimatePresence';
import styles from './Default.module.css';

interface Props {
  children: ReactNode;
  title: string;
  transitionTime: number;
  dontStickHeader: boolean;
  removeMainPadding: boolean;
  removeMainMargin: boolean;
  removeMainBackground: boolean;
  background?: string;
  noNav?: boolean;
};

const c_classFadeIn = 'fadeIn';
const c_classFadeOut = 'fadeOut';

const c_twitterLink = 'https://twitter.com/azulilah';
const c_instaLink = 'https://www.instagram.com/azulilah';
const c_tumblrLink = 'https://azulila.tumblr.com';

const DefaultLayout: FC<Props> = ({
  children,
  title,
  transitionTime,
  dontStickHeader,
  removeMainPadding,
  removeMainMargin,
  removeMainBackground,
  background,
  noNav,
}) => {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [mainTransitionStage, setMainTransitionStage] = useState(c_classFadeOut);

  useEffect(() => {
    setMainTransitionStage(c_classFadeIn);
  }, []);

  useEffect(() => {
    if (children !== displayChildren) {
      setMainTransitionStage(c_classFadeOut);
    }
  }, [children, setDisplayChildren, displayChildren]);

  return (
    <>
      <Head>
        <title>{title}</title>
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
            {!noNav &&
              <NavBar dontStick={dontStickHeader} />
            }
          </motion.div>
        </CustomAnimatePresence>

        <main
          className={`${dontStickHeader ? styles.dontStick : ''} ${removeMainPadding ? styles.removePadding : ''} ${removeMainBackground ? styles.removeBg : ''} ${removeMainMargin ? styles.removeMargin : ''}`}
        >
          <div
            onTransitionEnd={() => {
              if (mainTransitionStage === c_classFadeOut) {
                setDisplayChildren(children);
                setMainTransitionStage(c_classFadeIn);
              }
            }}
            className={`${styles.transitionContainer} ${styles[mainTransitionStage]}`}
          >
            {displayChildren}
          </div>
        </main>
      </div>
      <footer className={styles.footer}>
        <div className={styles.containerSocials}>
          <a href={c_twitterLink} target='_blank' rel='noreferrer'>
            <embed src='/icons/social-twitter.svg' />
          </a>
          <a href={c_instaLink} target='_blank' rel='noreferrer'>
            <embed src='/icons/social-insta.svg' />
          </a>
          <a href={c_tumblrLink} target='_blank' rel='noreferrer'>
            <embed src='/icons/social-tumblr.svg' />
          </a>
        </div>
        <p>
          <b>This website was created by Reuben Price - reuben.luke.p@gmail.com</b>
        </p>
      </footer>
    </>
  );
};

export default DefaultLayout;

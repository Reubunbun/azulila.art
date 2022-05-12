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
  CustomNav?: FC;
};

const c_twitterLink: string = 'https://twitter.com/azulilah';
const c_instaLink: string = 'https://www.instagram.com/azulilah';
const c_tumblrLink: string = 'https://azulila.tumblr.com';

const DefaultLayout: FC<Props> = ({
  children,
  title,
  transitionTime,
  dontStickHeader,
  removeMainPadding,
  removeMainMargin,
  removeMainBackground,
  background,
  CustomNav,
}) => {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('fadeOut');

  useEffect(() => {
    setTransitionStage("fadeIn");
  }, []);
  useEffect(() => {
    if (children !== displayChildren) setTransitionStage('fadeOut');
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
              : 'url("/main-bg.gif")'
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
            key={CustomNav ? `CustomNav-${CustomNav.name}` : 'DefaultNav'}
          >
            {!CustomNav &&
              <NavBar dontStick={dontStickHeader} />
            }
            {CustomNav &&
              <CustomNav />
            }
          </motion.div>
        </CustomAnimatePresence>
        <main
          className={`${dontStickHeader ? styles.dontStick : ''} ${removeMainPadding ? styles.removePadding : ''} ${removeMainBackground ? styles.removeBg : ''} ${removeMainMargin ? styles.removeMargin : ''}`}
        >
          <div
            onTransitionEnd={() => {
              if (transitionStage === 'fadeOut') {
                setDisplayChildren(children);
                setTransitionStage('fadeIn');
              }
            }}
            className={`${styles.pageContainer} ${styles[transitionStage]}`}
          >
            {displayChildren}
          </div>
        </main>
      </div>
      <footer className={styles.footer}>
        <div className={styles.containerSocials}>
          <a href={c_twitterLink} target='_blank' rel='noreferrer'>
            <embed src='/social-twitter.svg' />
          </a>
          <a href={c_instaLink} target='_blank' rel='noreferrer'>
            <embed src='/social-insta.svg' />
          </a>
          <a href={c_tumblrLink} target='_blank' rel='noreferrer'>
            <embed src='/social-tumblr.svg' />
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

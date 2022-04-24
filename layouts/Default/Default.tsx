import type { ReactNode, FC } from 'react';
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
}) => {

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={styles.pageContent}>
        <NavBar dontStick={dontStickHeader} />
        <main
          className={`${styles.main} ${dontStickHeader ? styles.dontStick : ''} ${removeMainPadding ? styles.removePadding : ''}`}
        >
          <CustomAnimatePresence exitBeforeEnter>
            <motion.div
              className='page-content'
              key={title}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: transitionTime}}
            >
              {children}
            </motion.div>
          </CustomAnimatePresence>
        </main>
      </div>
      <footer className={styles.footer}>
        <a href={c_twitterLink} target='_blank' rel='noreferrer'>
          <embed src='/social-twitter.svg' />
        </a>
        <a href={c_instaLink} target='_blank' rel='noreferrer'>
          <embed src='/social-insta.svg' />
        </a>
        <a href={c_tumblrLink} target='_blank' rel='noreferrer'>
          <embed src='/social-tumblr.svg' />
        </a>
      </footer>
    </>
  );
};

export default DefaultLayout;

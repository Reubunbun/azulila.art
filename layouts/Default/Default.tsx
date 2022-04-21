import type { ReactNode, FC } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import NavBar from '../../components/NavBar/NavBar';
import { AppStateProvider } from '../../context/AppContext';
import CustomAnimatePresence from '../../components/CustomAnimatePresence/CustomAnimatePresence';
import styles from './Default.module.css';

interface Props {
  children: ReactNode;
  title: string;
  transitionTime: number;
};

const c_twitterLink: string = 'https://twitter.com/azulilah';
const c_instaLink: string = 'https://www.instagram.com/azulilah';
const c_tumblrLink: string = 'https://azulila.tumblr.com';

const DefaultLayout: FC<Props> = ({children, title, transitionTime}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={styles.pageContent}>
        <NavBar/>
        <main className={styles.main}>
          <AppStateProvider>
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
          </AppStateProvider>
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

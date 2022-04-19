import type { ReactNode, FC } from 'react';
import Head from 'next/head';
import NavBar from '../../components/NavBar/NavBar';
import styles from './Default.module.css';

interface Props {
  children: ReactNode;
  title: string;
};


const c_twitterLink: string = 'https://twitter.com/azulilah';
const c_instaLink: string = 'https://www.instagram.com/azulilah';
const c_tumblrLink: string = 'https://azulila.tumblr.com';

const DefaultLayout: FC<Props> = ({children, title}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={styles.pageContent}>
        <NavBar/>
        <main className={styles.main}>
          {children}
        </main>
      </div>
      <footer className={styles.footer}>
        <a href={c_twitterLink} target='_blank' rel='noreferrer'>
          <embed src='social-twitter.svg' />
        </a>
        <a href={c_instaLink} target='_blank' rel='noreferrer'>
          <embed src='social-insta.svg' />
        </a>
        <a href={c_tumblrLink} target='_blank' rel='noreferrer'>
          <embed src='social-tumblr.svg' />
        </a>
      </footer>
    </>
  );
};

export default DefaultLayout;

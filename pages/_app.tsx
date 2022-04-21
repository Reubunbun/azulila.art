import type { AppProps } from 'next/app';
import type { Page } from '../interfaces/index';
import { AnimateSharedLayout } from 'framer-motion';
import { fixTransition } from '../helpers/fixTransition';
import DefaultLayout from '../layouts/Default/Default';
import '../styles/globals.css';

interface CustomAppProps extends AppProps {
  Component: Page;
};

const c_pageTransitionTime = 0.5 // seconds
fixTransition(c_pageTransitionTime * 1000);

function MyApp({ Component, pageProps }: CustomAppProps) {

  return (
    <AnimateSharedLayout >
      <DefaultLayout
        title={Component.title}
        transitionTime={c_pageTransitionTime}
      >
        <Component {...pageProps}/>
      </DefaultLayout>
    </AnimateSharedLayout>
  );
}

export default MyApp;

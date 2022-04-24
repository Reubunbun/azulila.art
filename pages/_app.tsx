import type { AppProps } from 'next/app';
import type { Page } from '../interfaces/index';
import { AnimateSharedLayout } from 'framer-motion';
import { fixTransition } from '../helpers/fixTransition';
import { CommissionStateProvider } from '../context/CommissionContext';
import DefaultLayout from '../layouts/Default/Default';
import '../styles/globals.css';

interface CustomAppProps extends AppProps {
  Component: Page;
};

declare global {
  interface Window { navigatingTo: string | null }
};

const c_pageTransitionTime = 0.5 // seconds
fixTransition(c_pageTransitionTime * 1000);

if (typeof window !== 'undefined') {
  window.navigatingTo = null;
}

function MyApp({ Component, pageProps }: CustomAppProps) {
  if (typeof window !== 'undefined') {
    window.navigatingTo = Component.title;
  }

  return (
    <AnimateSharedLayout>
      <CommissionStateProvider>
        <DefaultLayout
          title={Component.title}
          dontStickHeader={!!Component.dontStick}
          removeMainPadding={!!Component.removePadding}
          transitionTime={c_pageTransitionTime}
        >
          <Component {...pageProps}/>
        </DefaultLayout>
      </CommissionStateProvider>
    </AnimateSharedLayout>
  );
}

export default MyApp;

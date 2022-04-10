import type { AppProps } from 'next/app';
import type { Page } from '../interfaces/index';
import { AnimateSharedLayout } from 'framer-motion';
import DefaultLayout from '../layouts/Default/Default';
import '../styles/globals.css';

interface CustomAppProps extends AppProps {
  Component: Page;
};

function MyApp({ Component, pageProps }: CustomAppProps) {
  return (
    <AnimateSharedLayout>
      <DefaultLayout title={Component.title}>
        <Component {...pageProps} />
      </DefaultLayout>
    </AnimateSharedLayout>
  );
}

export default MyApp;

import type { AppProps } from 'next/app';
import { AnimateSharedLayout } from 'framer-motion';
import { AppStateProvider } from '../context/AppStateProvider';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AnimateSharedLayout>
      <AppStateProvider>
        <Component {...pageProps} />
      </AppStateProvider>
    </AnimateSharedLayout>
  );
}

export default MyApp

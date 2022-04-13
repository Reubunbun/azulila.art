import type { AppProps } from 'next/app';
import type { Page } from '../interfaces/index';
import { AnimateSharedLayout, AnimatePresence, motion } from 'framer-motion';
import DefaultLayout from '../layouts/Default/Default';
import '../styles/globals.css';

interface CustomAppProps extends AppProps {
  Component: Page;
};

function MyApp({ Component, pageProps }: CustomAppProps) {
  console.log('in app!');
  return (
    <AnimateSharedLayout>
      <DefaultLayout title={Component.title}>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            key={Component.title}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </DefaultLayout>
    </AnimateSharedLayout>
  );
}

export default MyApp;

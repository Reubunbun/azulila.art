import type { AppProps } from 'next/app';
import type { Page } from '../interfaces/index';
import { AnimateSharedLayout, motion } from 'framer-motion';
import { fixTransition } from '../helpers/fixTransition';
import CustomAnimatePresence from '../components/CustomAnimatePresence/CustomAnimatePresence';
import DefaultLayout from '../layouts/Default/Default';
import '../styles/globals.css';

interface CustomAppProps extends AppProps {
  Component: Page;
};

const c_pageTransitionTime = 0.5 // seconds
fixTransition(c_pageTransitionTime * 1000);

function MyApp({ Component, pageProps }: CustomAppProps) {
  return (
    <AnimateSharedLayout>
      <DefaultLayout title={Component.title}>
        <CustomAnimatePresence exitBeforeEnter>
          <motion.div
            className='page-content'
            key={Component.title}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{
              duration: c_pageTransitionTime
            }}
          >
            <Component {...pageProps} />
          </motion.div>
        </CustomAnimatePresence>
      </DefaultLayout>
    </AnimateSharedLayout>
  );
}

export default MyApp;

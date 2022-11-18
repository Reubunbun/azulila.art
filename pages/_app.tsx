import type { AppProps } from 'next/app';
import type { Page } from 'interfaces/index';
import { AnimateSharedLayout } from 'framer-motion';
import { fixTransition } from 'helpers/fixTransition';
import { CommissionStateProvider } from 'context/CommissionContext';
import { UIStateProvider } from 'context/UIContext';
import DefaultLayout from 'layouts/Default/Default';
import 'styles/globals.css';

interface CustomAppProps extends AppProps {
  Component: Page;
};

const c_pageTransitionTime = 0.5 // seconds
fixTransition(c_pageTransitionTime * 1000);

function MyApp({ Component, pageProps }: CustomAppProps) {
  return (
    <AnimateSharedLayout>
      <CommissionStateProvider>
        <UIStateProvider>
          <DefaultLayout
            title={Component.title}
            description={Component.description}
            dontStickHeader={!!Component.dontStick}
            removeMainPadding={!!Component.removePadding}
            removeMainMargin={!!Component.removeMargin}
            removeMainBackground={!!Component.removeBg}
            background={Component.background}
            noNav={Component.noNav}
            transitionTime={c_pageTransitionTime}
          >
            <Component {...pageProps}/>
          </DefaultLayout>
        </UIStateProvider>
      </CommissionStateProvider>
    </AnimateSharedLayout>
  );
}

export default MyApp;

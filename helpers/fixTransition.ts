import Router from 'next/router';

export const fixTransition = (timeout: number): void => {
  Router.events.on('routeChangeStart', () => {
    const pageContainer = window.document.getElementById('animate-container');
    console.log(pageContainer);
    if (!pageContainer) return;

    console.log('activating anim');
    pageContainer.style.animation = '';
    void pageContainer.offsetWidth;
    pageContainer.style.animation = 'transition 1s linear';
  });

  Router.events.on('beforeHistoryChange', () => {
    // Create a clone of every <style> and <link> that currently affects the page. It doesn't matter
    // if Next.js is going to remove them or not since we are going to remove the copies ourselves
    // later on when the transition finishes.
    const nodes = document.querySelectorAll('link[rel=stylesheet], style:not([media=x])');
    const copies = [...nodes].map((el) => el.cloneNode(true) as HTMLElement);

    for (let copy of copies) {
      // Remove Next.js' data attributes so the copies are not removed from the DOM in the route
      // change process.
      copy.removeAttribute('data-n-p');
      copy.removeAttribute('data-n-href');

      // Add duplicated nodes to the DOM.
      document.head.appendChild(copy);
    }

    const handler = () => {
      // Emulate a `.once` method using `.on` and `.off`
      Router.events.off('routeChangeComplete', handler)

      window.setTimeout(
        () => {
          for (let copy of copies) {
            // Remove previous page's styles after the transition has finalized.
            document.head.removeChild(copy)
          }
        },
        timeout,
      );
    };

    Router.events.on('routeChangeComplete', handler);
  })
};

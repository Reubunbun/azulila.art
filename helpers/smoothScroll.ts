const scrollToTop = (): Promise<undefined> => {
  if (typeof window === 'undefined') {
    return new Promise((res, rej) => rej());
  }
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });

  return new Promise((res, rej) => {
    const failed = setTimeout(() => rej(), 2000);

    const scrollHandler = () => {
      if (window.pageYOffset === 0) {
        window.removeEventListener('scroll', scrollHandler);
        clearTimeout(failed);
        res(undefined);
      }
    };

    if (window.pageYOffset === 0) {
      window.removeEventListener('scroll', scrollHandler);
      clearTimeout(failed);
      res(undefined);
    } else {
      window.addEventListener('scroll', scrollHandler);
    }
  });
};

export default scrollToTop;

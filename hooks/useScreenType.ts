import { useEffect, useState } from 'react';
import { ScreenType } from '../interfaces';

export default function useScreenType() : ScreenType {
  const [screenType, setScreenType] = useState<ScreenType>(
    typeof window === 'undefined'
      ? ScreenType.desktop
      : window.innerWidth <= 758
          ? ScreenType.mobile
          : window.innerWidth <= 1024
            ? ScreenType.tablet
            : ScreenType.desktop,
  );

  useEffect(() => {
    const resize = () => setScreenType(
      window.innerWidth <= 758
      ? ScreenType.mobile
      : window.innerWidth <= 1300
        ? ScreenType.tablet
        : ScreenType.desktop,
    );

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return screenType;
};

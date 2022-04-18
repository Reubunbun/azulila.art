import { useEffect, useState } from 'react';
import { ScreenType } from '../interfaces';

export default function useScreenType(mobileThreshold: number = 768) : ScreenType {
  const [screenType, setScreenType] = useState<ScreenType>(
    typeof window === 'undefined'
      ? ScreenType.desktop
      : window.innerWidth <= mobileThreshold
        ? ScreenType.mobile
        : window.innerWidth <= 1024
          ? ScreenType.tablet
          : window.innerWidth <= 1450
            ? ScreenType.smallDesktop
            : ScreenType.desktop,
  );

  useEffect(() => {
    const resize = () => setScreenType(
      typeof window === 'undefined'
        ? ScreenType.desktop
        : window.innerWidth <= mobileThreshold
          ? ScreenType.mobile
          : window.innerWidth <= 1024
            ? ScreenType.tablet
            : window.innerWidth <= 1450
              ? ScreenType.smallDesktop
              : ScreenType.desktop,
    );

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return screenType;
};

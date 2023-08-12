import { useEffect, useState } from 'react';
import { ScreenType } from 'interfaces';

const determineScreenType = (mobileThreshold: number): ScreenType => {
  if (typeof window === 'undefined') return ScreenType.desktop;

  if (window.innerWidth <= mobileThreshold) {
    return ScreenType.mobile;
  }

  if (window.innerWidth <= 1024) {
    return ScreenType.tablet;
  }

  if (window.innerWidth <= 1920) {
    return ScreenType.desktop;
  }

  if (window.innerWidth <= 2560) {
    return ScreenType.large;
  }

  return ScreenType.extraLarge;
};

export default function useScreenType(
  mobileThreshold: number = 768,
) : ScreenType {
  const [screenType, setScreenType] = useState<ScreenType>(
    determineScreenType(mobileThreshold),
  );

  useEffect(() => {
    const resize = () => setScreenType(determineScreenType(mobileThreshold));

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return screenType;
};

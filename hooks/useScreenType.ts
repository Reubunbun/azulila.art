import { useEffect, useState } from 'react';
import { ScreenType } from '../interfaces';

const c_determinScreenType = (mobileThreshold: number): ScreenType => {
  if (typeof window === 'undefined') return ScreenType.desktop;

  if (window.innerWidth <= mobileThreshold) {
    return ScreenType.mobile;
  }

  if (window.innerWidth <= 1024) {
    return ScreenType.tablet;
  }

  return ScreenType.desktop;
};

export default function useScreenType(
  mobileThreshold: number = 768,
) : ScreenType {
  const [screenType, setScreenType] = useState<ScreenType>(
    c_determinScreenType(mobileThreshold),
  );

  useEffect(() => {
    const resize = () => setScreenType(c_determinScreenType(mobileThreshold));

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return screenType;
};

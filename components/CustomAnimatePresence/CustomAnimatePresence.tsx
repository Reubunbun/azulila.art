import type { FC, ReactNode } from 'react';
import type { AnimatePresenceProps } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

type CustomAnimatePresenceProps = AnimatePresenceProps & {
  children: ReactNode;
};

const CustomAnimatePresence: FC<CustomAnimatePresenceProps> = AnimatePresence;
export default CustomAnimatePresence;

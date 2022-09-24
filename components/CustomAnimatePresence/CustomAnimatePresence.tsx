import type { FC, ReactNode } from 'react';
import { type AnimatePresenceProps, AnimatePresence } from 'framer-motion';

type CustomAnimatePresenceProps = AnimatePresenceProps & {
  children: ReactNode;
};

const CustomAnimatePresence: FC<CustomAnimatePresenceProps> = AnimatePresence;
export default CustomAnimatePresence;

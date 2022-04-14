import { motion } from 'framer-motion';
import type { FC, ReactNode } from 'react';
import styles from './ModalBackdrop.module.css';

interface Props {
  children: ReactNode;
  close: () => void;
};

const ModalBackdrop: FC<Props> = ({children, close}) => {
  return (
    <motion.div
      className={styles.backdrop}
      onClick={close}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
    >
      {children}
    </motion.div>
  );
};

export default ModalBackdrop;

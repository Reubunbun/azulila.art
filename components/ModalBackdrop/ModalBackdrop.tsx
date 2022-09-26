import { motion } from 'framer-motion';
import { type FC, type ReactNode, useEffect } from 'react';
import styles from './ModalBackdrop.module.css';

interface Props {
  children: ReactNode;
  close: () => void;
};

const ModalBackdrop: FC<Props> = ({children, close}) => {
  useEffect(() => {
    const callbackKeyup = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keyup', callbackKeyup);
    return () => document.removeEventListener('keyup', callbackKeyup);
  }, [close]);

  return (
    <motion.div
      className={styles.backdrop}
      onClick={close}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      unselectable='on'
    >
      {children}
    </motion.div>
  );
};

export default ModalBackdrop;

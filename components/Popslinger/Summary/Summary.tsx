import type { FC } from 'react';
import { memo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';
import sharedStyles from '../shared.module.css';

const Summary: FC = () => {
  const textAnimation = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      textAnimation.start({
        opacity: 1,
        transition: {
          type: 'tween',
          duration: 0.7,
        },
      });
    }
  }, [inView]);

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={textAnimation}
      exit={{opacity: 0}}
      ref={ref}
      className={sharedStyles.textContainer}
      style={{paddingTop: '2rem', paddingBottom: '2rem'}}
    >
      <p>General summary of what popslinger is and the work ive contributed to it</p>
      <p>General summary of what popslinger is and the work ive contributed to it</p>
      <p>General summary of what popslinger is and the work ive contributed to it</p>
      <p>General summary of what popslinger is and the work ive contributed to it</p>
      <p>General summary of what popslinger is and the work ive contributed to it</p>
      <p>General summary of what popslinger is and the work ive contributed to it</p>
      <p>General summary of what popslinger is and the work ive contributed to it</p>
      <p>General summary of what popslinger is and the work ive contributed to it</p>
      <p>General summary of what popslinger is and the work ive contributed to it</p>
      <p>General summary of what popslinger is and the work ive contributed to it</p>
      <p>General summary of what popslinger is and the work ive contributed to it</p>
    </motion.div>
  );
};

export default memo(Summary);

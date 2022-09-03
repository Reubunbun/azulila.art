import type { FC } from 'react';
import { memo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';
import sharedStyles from '../shared.module.css';
import styles from './Summary.module.css';

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
      className={`${sharedStyles.textContainer} ${styles.mainContainer}`}
      style={{paddingTop: '2rem', paddingBottom: '2rem'}}
    >
      <p>
        Popslinger’s a musical shoot-em-up inspired by City Pop and 90’s anime. It follows the young Ria and Gin on the way to beat the evil gang of Corazones. It made its way to Steam and Nintendo Switch on January 2022, with the recognition of being selected as one of the indie games of the month.
      </p>
      <div className={styles.youtubeWrapper}>
        <h3>Watch the trailer!</h3>
        <div className={styles.youtubeContainer}>
          <iframe
            width='672'
            height='378'
            src='https://www.youtube.com/embed/0KYUvhjCH74'
            title='Popslinger Trailer'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        </div>
      </div>
      <p>
        I worked in various areas such as background design, animation, character design, illustrations, among others. My main focus was art direction on background design, while assisting in other details.
      </p>

      <p>(Some gifs here)</p>
    </motion.div>
  );
};

export default memo(Summary);

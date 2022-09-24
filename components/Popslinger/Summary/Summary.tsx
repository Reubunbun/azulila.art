import { type FC, memo, useEffect, useRef, MutableRefObject } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';
import sharedStyles from '../shared.module.css';
import styles from './Summary.module.css';

const Summary: FC = () => {
  const anim1 = useAnimation();
  const anim2 = useAnimation();
  const anim3 = useAnimation();

  const animGif1 = useAnimation();
  const animGif2 = useAnimation();
  const animGif3 = useAnimation();

  const { ref: mainContainerRef, inView: mainContainerInView } = useInView({
    threshold: 0.5,
  });
  const { ref: gifContainerRef, inView: gifContainerInView } = useInView({
    threshold: 0.6,
  });
  const refSpriteSheet = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    const fadeDuration = 0.8;
    if (mainContainerInView) {
      anim1.start({
        opacity: 1,
        transition: {
          type: 'tween',
          duration: fadeDuration,
        },
      });
      anim2.start({
        opacity: 1,
        transition: {
          type: 'tween',
          duration: fadeDuration,
          delay: (fadeDuration * 0.8),
        },
      });
      anim3.start({
        opacity: 1,
        transition: {
          type: 'tween',
          duration: fadeDuration,
          delay: (fadeDuration * 0.8) * 2,
        },
      })

    }
  }, [mainContainerInView]);

  useEffect(() => {
    const animDuration = 1.2;
    if (gifContainerInView) {
      animGif1.start({
        opacity: 1,
        top: '0px',
        transition: {
          type: 'tween',
          duration: animDuration,
        },
      });
      animGif2.start({
        opacity: 1,
        top: '-13%',
        transition: {
          type: 'tween',
          duration: animDuration,
          delay: (animDuration * 0.8),
        },
      });
      animGif3.start({
        opacity: 1,
        top: '-22%',
        transition: {
          type: 'tween',
          duration: animDuration,
          delay: (animDuration * 0.8) * 2,
        },
      }).then(() => {
        if (!refSpriteSheet.current) {
          return;
        }

        refSpriteSheet.current.style.animationPlayState = 'running';
      });

    }
  }, [gifContainerInView]);

  return (
    <>
      <div
        ref={mainContainerRef}
        className={`${sharedStyles.textContainer} ${styles.mainContainer}`}
      >
        <motion.h3
          initial={{opacity: 0}}
          animate={anim1}
          className={`${sharedStyles.sectionSubTitle} ${styles.sectionSubTitle}`}
        >
          What’s Popslinger?
        </motion.h3>
        <motion.p
          initial={{opacity: 0}}
          animate={anim1}
        >
          Popslinger’s a musical shoot-em-up inspired by City Pop and 90’s anime. It follows the young Ria and Gin on the way to beat the evil gang of Corazones. It made its way to Steam and Nintendo Switch on January 2022, with the recognition of being selected as one of the indie games of the month.
        </motion.p>
        <motion.div
          initial={{opacity: 0}}
          animate={anim2}
          className={styles.youtubeWrapper}
        >
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
        </motion.div>
        <motion.p
          initial={{opacity: 0}}
          animate={anim3}
        >
          I worked in various areas such as background design, animation, character design, illustrations, among others. My main focus was art direction on background design, while assisting in other details.
        </motion.p>

      </div>
      <div
        ref={gifContainerRef}
        className={styles.containerGifs}
      >
        <motion.img
          initial={{
            opacity: 0,
            top: '15%',
          }}
          animate={animGif1}
          src='/popslinger/gifs/Gin.gif'
          alt='Gin talking gif'
        />
        <motion.img
          initial={{
            opacity: 0,
            top: '0%',
          }}
          animate={animGif2}
          src='/popslinger/gifs/RiaProfile.gif'
          alt='Ria talking gif'
        />
        <motion.div
          initial={{
            opacity: 0,
            top: '0%',
          }}
          animate={animGif3}
          className={styles.spriteSheet}
          ref={refSpriteSheet}
        />
      </div>
    </>
  );
};

export default memo(Summary);

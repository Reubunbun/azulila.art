import type { Page } from '../../../interfaces/index';
import { useRouter } from 'next/router';
import StaticContainer from '../../../components/Popslinger/StaticContainer/StaticContainer';
import ParallaxContainer from '../../../components/Popslinger/ParallaxContainer/ParallaxContainer';
import Carousel from '../../../components/Carousel/Carousel';
import styles from './Popslinger.module.css';

const c_backgroundDesignImages = [
  '/popslinger/concept-art/1.png',
  '/popslinger/concept-art/2.png',
  '/popslinger/concept-art/3.png',
  '/popslinger/concept-art/4.png',
  '/popslinger/concept-art/6.png',
  '/popslinger/concept-art/7.jpg',
  '/popslinger/concept-art/test.png',
];

const Popslinger: Page = () => {
  const router = useRouter();

  return (
    <>
      <button
        className={styles.goBackBtn}
        onClick={() => router.push('/work')}
      >
        Go Back
      </button>
      <ParallaxContainer imgSrc='/popslinger/main-title.jpg' imgAlt='fill this later'>
        <div
          className={styles.containerLogo}
        >
          <img
            src='/popslinger/Popslinger_Logo_T3.png'
            alt='Logo for popslinger'
          />
        </div>
      </ParallaxContainer>
      <StaticContainer>
        <div className={styles.textContainer}>
          <p>General summary of what popslinger is and the work ive contributed to it</p>
          <p>General summary of what popslinger is and the work ive contributed to it</p>
          <p>General summary of what popslinger is and the work ive contributed to it</p>
          <p>General summary of what popslinger is and the work ive contributed to it</p>
        </div>
      </StaticContainer>
      <ParallaxContainer imgSrc='/popslinger/backgrounds-title.jpg' imgAlt='fill this later'>
        <h1 className={styles.sectionTitle}>Background Design</h1>
      </ParallaxContainer>
      <StaticContainer>
        <h3 className={styles.sectionSubTitle}>
          Working as a Background Designer in Popslinger
        </h3>
        <div className={styles.textWithImageContainer}>
          <p>
            Video games have been one of my biggest artistic inspirations in life; when the opportunity arose to work on one, I was thrilled. Working on it was a different story; there was a lot of effort and deadlines to fulfill.
          </p>
          <div className={styles.carouselContainer}>
            <Carousel
              images={c_backgroundDesignImages}
              randomOrder={false}
            />
          </div>
        </div>
        <div className={styles.textContainer} style={{paddingTop: 0}}>
          <p>
            Background design was something that I wanted to focus in my art career and this game shows my knowledge regarding this area, I learned how to apply it from an animation viewpoint to a video game one, which include background assets, floor tiles, props and more.<br />My inspirations while designing these assets included games, artists and musicians like The World Ends With You, Streets of Rage, Hiroshi Nagai and Tatsuro Yamashita.
          </p>
        </div>
      </StaticContainer>
    </>
  );
};

Popslinger.title = 'Popslinger';
Popslinger.background = 'popslinger-bg.gif';
Popslinger.noNav = true;
Popslinger.removeBg = true;
Popslinger.removeMargin = true;
Popslinger.removePadding = true;

export default Popslinger;

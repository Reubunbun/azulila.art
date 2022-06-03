import type { Page } from '../../../interfaces/index';
import { useRouter } from 'next/router';
import StaticContainer from '../../../components/Popslinger/StaticContainer/StaticContainer';
import ParallaxContainer from '../../../components/Popslinger/ParallaxContainer/ParallaxContainer';
import Carousell from '../../../components/Popslinger/Carousell/Carousell';
import Summary from '../../../components/Popslinger/Summary/Summary';
import styles from './Popslinger.module.css';

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
        <h2
          className={styles.sectionTitle}
          style={{marginBottom: '20rem'}}
        >
          Popslinger
        </h2>
      </ParallaxContainer>
      <StaticContainer>
        <Summary />
      </StaticContainer>
      <ParallaxContainer imgSrc='/popslinger/concept-art-title.png' imgAlt='fill this later'>
        <h2 className={styles.sectionTitle}>Concept Art</h2>
      </ParallaxContainer>
      <StaticContainer>
        <div className={styles.carousellSection}>
          <p>Brief summary for concept art</p>
          <Carousell
            imgURLs={[
              '/popslinger/concept-art/1.png',
              '/popslinger/concept-art/2.png',
              '/popslinger/concept-art/3.png',
              '/popslinger/concept-art/4.png',
              '/popslinger/concept-art/5.jpg',
              '/popslinger/concept-art/6.png',
              '/popslinger/concept-art/7.jpg',
            ]}
          />
        </div>
      </StaticContainer>
      <ParallaxContainer imgSrc='/popslinger/illustrations-title.jpg' imgAlt='fill this later'>
        <h2 className={styles.sectionTitle}>Illusations</h2>
      </ParallaxContainer>
      <StaticContainer>
        <div className={styles.carousellSection}>
          <p>Brief summary for Illustrations</p>
          <Carousell
            imgURLs={[
              '/popslinger/concept-art/1.png',
              '/popslinger/concept-art/2.png',
              '/popslinger/concept-art/3.png',
              '/popslinger/concept-art/4.png',
              '/popslinger/concept-art/5.jpg',
              '/popslinger/concept-art/6.png',
              '/popslinger/concept-art/7.jpg',
            ]}
          />
        </div>
      </StaticContainer>
      <ParallaxContainer imgSrc='/popslinger/comics-title.png' imgAlt='fill this later'>
        <h2 className={styles.sectionTitle}>Comics</h2>
      </ParallaxContainer>
      <StaticContainer>
        <div className={styles.carousellSection}>
          <p>Brief summary for comics</p>
          <Carousell
            imgURLs={[
              '/popslinger/concept-art/1.png',
              '/popslinger/concept-art/2.png',
              '/popslinger/concept-art/3.png',
              '/popslinger/concept-art/4.png',
              '/popslinger/concept-art/5.jpg',
              '/popslinger/concept-art/6.png',
              '/popslinger/concept-art/7.jpg',
            ]}
          />
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

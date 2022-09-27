import type { Page } from 'interfaces';
import { useRouter } from 'next/router';
import { useState, useRef, useLayoutEffect } from 'react';
import scrollToTop from 'helpers/smoothScroll';
import StaticContainer from 'components/Popslinger/StaticContainer/StaticContainer';
import ParallaxContainer from 'components/Popslinger/ParallaxContainer/ParallaxContainer';
import Summary from 'components/Popslinger/Summary/Summary';
import BackgroundDesign from 'components/Popslinger/BackgroundDesign/BackgroundDesign';
import ConceptArt from 'components/Popslinger/ConceptArt/ConceptArt';
import GameAssets from 'components/Popslinger/GameAssets/GameAssets';
import PromotionalComic from 'components/Popslinger/PromotionalComic/PromotionalComic';
import styles from './Popslinger.module.css';

const Popslinger: Page = () => {
  const router = useRouter();
  const [logoLoaded, setLogoLoaded] = useState<boolean>(false);
  const refLogo = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    if (!refLogo.current) {
      setLogoLoaded(true);
      return;
    }

    if (refLogo.current.complete && refLogo.current.naturalHeight !== 0) {
      setLogoLoaded(true);
    }
  }, []);

  return (
    <>
      <button
        className={styles.goBackBtn}
        onClick={() => scrollToTop().then(() => router.push('/work'))}
      >
        Go Back
      </button>
      <ParallaxContainer imgSrc='/popslinger/main-title.jpg' imgAlt='fill this later'>
        <div className={styles.containerLogo}>
          {!logoLoaded &&
            <h1 className={styles.sectionTitle}>
              POPSLINGER
            </h1>
          }
          <img
            src='/popslinger/popslinger-logo.png'
            alt='Logo for popslinger'
            onLoad={() => setLogoLoaded(true)}
            ref={refLogo}
            style={{display: logoLoaded ? undefined : 'none'}}
          />
        </div>
      </ParallaxContainer>
      <StaticContainer>
        <Summary />
      </StaticContainer>
      <ParallaxContainer
        imgSrc='/popslinger/backgrounds/Planet.png'
        imgAlt='fill this later'
      >
        <div className={styles.containerTitle}>
          <h1 className={styles.sectionTitle} style={{color: '#4481df'}}>
            Background Design
          </h1>
        </div>
      </ParallaxContainer>
      <StaticContainer>
        <BackgroundDesign />
      </StaticContainer>
      <ParallaxContainer
        imgSrc='/popslinger/concept-art/PurpleLounge-Concept-3.png'
        imgAlt='fill this later'
      >
        <div className={styles.containerTitle}>
          <h1 className={styles.sectionTitle} style={{color: '#df4444'}}>
            Concept Art
          </h1>
        </div>
      </ParallaxContainer>
      <StaticContainer>
        <ConceptArt />
      </StaticContainer>
      <ParallaxContainer
        imgSrc='/popslinger/assets/Props1.png'
        imgAlt='fill this later'
      >
        <div className={styles.containerTitle}>
          <h1 className={styles.sectionTitle} style={{color: '#c152b5'}}>
            Game Assets
          </h1>
        </div>
      </ParallaxContainer>
      <StaticContainer>
        <GameAssets />
      </StaticContainer>
      <ParallaxContainer
        imgSrc='/popslinger/illustrations/Wave.png'
        imgAlt='fill this later'
      >
        <div className={styles.containerTitle}>
          <h1 className={styles.sectionTitle} style={{color: '#fffff3'}}>
            Promotional Comic
          </h1>
        </div>
      </ParallaxContainer>
      <StaticContainer>
        <PromotionalComic />
      </StaticContainer>
    </>
  );
};

Popslinger.title = 'Popslinger';
Popslinger.background = 'backgrounds/popslinger-bg.gif';
Popslinger.noNav = true;
Popslinger.removeBg = true;
Popslinger.removeMargin = true;
Popslinger.removePadding = true;

export default Popslinger;

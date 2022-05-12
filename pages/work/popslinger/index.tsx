import type { Page } from '../../../interfaces/index';
import PopslingerNav from '../../../components/Popslinger/Nav/PopslingerNav';
import StaticContainer from '../../../components/Popslinger/StaticContainer/StaticContainer';
import ParallaxContainer from '../../../components/Popslinger/ParallaxContainer/ParallaxContainer';
import ConceptArt from '../../../components/Popslinger/ConceptArt/ConceptArt';
import styles from './Popslinger.module.css';

const Popslinger: Page = () => {
  return (
    <>
      <StaticContainer>
        <p style={{marginTop: 0}}>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p style={{marginBottom: 0}}>content</p>
      </StaticContainer>
      <ParallaxContainer imgSrc='/pop-bg1.png' imgAlt='fill this later'>
        <h2 className={styles.sectionTitle}>Concept Art</h2>
      </ParallaxContainer>
      <StaticContainer>
        <ConceptArt />
      </StaticContainer>
      <ParallaxContainer imgSrc='/pop-bg2.jpg' imgAlt='fill this later'>
        <h2 className={styles.sectionTitle}>Illusations</h2>
      </ParallaxContainer>
      <StaticContainer>
        <p style={{marginTop: 0}}>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p>content</p>
        <p style={{marginBottom: 0}}>content</p>
      </StaticContainer>
    </>
  );
};

Popslinger.title = 'Popslinger';
Popslinger.background = 'popslinger-bg.gif';
Popslinger.customNav = PopslingerNav;
Popslinger.removeBg = true;
Popslinger.removeMargin = true;
Popslinger.removePadding = true;

export default Popslinger;

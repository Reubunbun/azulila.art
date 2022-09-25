import { type FC } from 'react';
import Carousel from '../../Carousel/Carousel';
import sharedStyles from '../shared.module.css';
import styles from './GameAssets.module.css';

const c_assetImages = [
  '/popslinger/assets/Hub-Buildings.png',
  '/popslinger/assets/Hub-Buildings2.png',
  '/popslinger/assets/Profiles.png',
  '/popslinger/assets/Props1.png',
  '/popslinger/assets/Props2.png',
];

const GameAssets: FC = () => {
  return (
    <>
      <h3 className={`${sharedStyles.sectionSubTitle}`}>
        Game Assets
      </h3>
      <div
        className={`${sharedStyles.textContainer} ${styles.textContainer}`}
      >
        <p>
          Here are a few examples of the various game assets made for the game.
        </p>
        <div className={styles.carouselContainer}>
          <Carousel
            images={c_assetImages}
            maxHeight='40rem'
          />
        </div>
      </div>
    </>
  );
};

export default GameAssets;

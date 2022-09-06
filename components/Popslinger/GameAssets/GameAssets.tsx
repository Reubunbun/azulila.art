import type { FC } from 'react';
import { memo } from 'react';
import Carousel from '../../Carousel/Carousel';
import sharedStyles from '../shared.module.css';
import styles from './GameAssets.module.css';

const c_placeholderImages = [
  '/popslinger/concept-art/1.png',
  '/popslinger/concept-art/2.png',
  '/popslinger/concept-art/3.png',
  '/popslinger/concept-art/4.png',
  '/popslinger/concept-art/6.png',
  '/popslinger/concept-art/7.jpg',
  '/popslinger/concept-art/test.png',
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
            images={c_placeholderImages}
            randomOrder={false}
          />
        </div>
      </div>
    </>
  );
};

export default memo(GameAssets);

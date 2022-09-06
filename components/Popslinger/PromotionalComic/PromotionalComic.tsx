import type { FC } from 'react';
import { memo } from 'react';
import Carousel from '../../Carousel/Carousel';
import sharedStyles from '../shared.module.css';
import styles from './PromotionalComic.module.css';

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
        Promotional Comic
      </h3>
      <div
        className={`${sharedStyles.textContainer} ${styles.textContainer}`}
      >
        <p>
          A promotional comic for the release of the game, click the cover below to give it a read (I will change this one so its not a carousel, instead the cover of the comic and when you click it you can go left/right to read it like a book)
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

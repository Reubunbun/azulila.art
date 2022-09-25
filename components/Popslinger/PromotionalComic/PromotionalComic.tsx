import { type FC } from 'react';
import Carousel from '../../Carousel/Carousel';
import sharedStyles from '../shared.module.css';
import styles from './PromotionalComic.module.css';

const c_comicImages = [
  '/popslinger/comic/1.jpg',
  '/popslinger/comic/2.jpg',
  '/popslinger/comic/3.jpg',
  '/popslinger/comic/4.jpg',
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
          A promotional comic for the release of the game
        </p>
        <div className={styles.carouselContainer}>
          <Carousel
            images={c_comicImages}
            maxHeight='88.5vh'
          />
        </div>
      </div>
    </>
  );
};

export default GameAssets;

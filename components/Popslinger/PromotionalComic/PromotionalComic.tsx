import { type FC, memo } from 'react';
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
          A promotional comic for the release of the game, click the cover below to give it a read (I will change this one so its not a carousel, instead the cover of the comic and when you click it you can go left/right to read it like a book)
        </p>
        <div className={styles.carouselContainer}>
          <Carousel
            images={c_comicImages}
            maxHeight='40rem'
            minHeight='20rem'
          />
        </div>
      </div>
    </>
  );
};

export default memo(GameAssets);

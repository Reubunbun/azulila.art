import type { FC } from 'react';
import { memo } from 'react';
import Carousel from '../../Carousel/Carousel';
import sharedStyles from '../shared.module.css';
import styles from './Placeholder.module.css';

const c_placeholderImages = [
  '/popslinger/concept-art/1.png',
  '/popslinger/concept-art/2.png',
  '/popslinger/concept-art/3.png',
  '/popslinger/concept-art/4.png',
  '/popslinger/concept-art/6.png',
  '/popslinger/concept-art/7.jpg',
  '/popslinger/concept-art/test.png',
];

const Placeholder: FC = () => {
  return (
    <>
      <h3 className={`${sharedStyles.sectionSubTitle} ${styles.sectionSubTitle}`}>
        Placeholder text placeholder text
      </h3>
      <div className={`${sharedStyles.textContainer} ${styles.textContainer}`}>
        <p>
        Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text.
        </p>
      </div>
      <div className={`${sharedStyles.textContainer} ${styles.textWithImageContainer}`}>
        <div className={styles.carouselContainer}>
          <Carousel
            images={c_placeholderImages}
            randomOrder={false}
          />
        </div>
        <p>
          Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text.
        </p>
      </div>
      <div className={`${sharedStyles.textContainer} ${styles.textContainer}`}>
        <p>
        Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text Placeholder text placeholder text. Placeholder text Placeholder text placeholder text Placeholder text placeholder text.
        </p>
      </div>
    </>
  );

};

export default memo(Placeholder);

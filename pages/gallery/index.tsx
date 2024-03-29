import type { GetStaticProps } from 'next';
import {type Page, type Image, ScreenType, Direction } from 'interfaces';
import { useState, useRef, useEffect, useCallback, Fragment } from 'react';
import { Client as PGClient } from 'pg';
import DaoPortfolioImages from 'dao/images';
import DaoTags from 'dao/tags';
import { motion, useAnimation } from 'framer-motion';
import { useUIContext } from 'context/UIContext';
import BurgerButton from 'components/BurgerButton/BurgerButton';
import Filters from 'components/Filters/Filters';
import ImageItem from 'components/ImageItem/ImageItem';
import ImageModal from 'components/ImageModal/ImageModal';
import useScreenType from 'hooks/useScreenType';
import styles from './Gallery.module.css';

interface Props {
  images: Image[];
  tags: string[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const props: Props = {
    images: [],
    tags: [],
  };

  const pgClient = new PGClient({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    ssl: { rejectUnauthorized: false },
  });

  try {
    await pgClient.connect();

    const daoPortfolioImages = new DaoPortfolioImages(pgClient);
    const daoTags = new DaoTags(pgClient);

    await Promise.all([
      daoPortfolioImages.getAll().then(res => props.images.push(...res.images)),
      daoTags.getAll().then(res => props.tags.push(...res)),
    ]);
  } catch (err) {
    console.log('err getting static props:', err);
  } finally {
    await pgClient.end();
  }

  return {
    props,
    revalidate: 300,
  };
};


interface DisplayImage extends Image {
  actualHeight: number;
}

interface Column {
  items: DisplayImage[];
  height: number;
}

const IMAGE_LIMIT = 10;
const COLUMN_MAP: {[key in ScreenType]: number} = {
  [ScreenType.mobile]: 1,
  [ScreenType.tablet]: 2,
  [ScreenType.desktop]: 3,
  [ScreenType.large]: 3,
  [ScreenType.extraLarge]: 3,
};
const genNewColumns = (screenType: ScreenType): Column[] => {
  const finalColumns: Column[] = [];
  for (let i = 0; i < COLUMN_MAP[screenType]; i++) {
    finalColumns.push({items: [], height: 0});
  }
  return finalColumns;
}


const Gallery: Page<Props> = ({images, tags}) => {
  const screenType = useScreenType();
  const filterAnimation = useAnimation();

  const loadedImages = useRef<{[url: string]: boolean}>({});
  const firstColDiv = useRef<HTMLDivElement | null>(null);

  const { setModalContent } = useUIContext();

  const [hideFilters, setHideFilters] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [imageColumns, setImageColumns] = useState<Column[]>(
    genNewColumns(screenType),
  );

  const callbackChangeFilter = useCallback((selected: string | null) => {
    setSelectedFilter(selected);
  }, []);

  const callbackClickImage = useCallback(
    (image: Image) => setModalContent(
      <ImageModal
        image={image}
        close={() => setModalContent(null)}
        getNextImage={(dir, currImage) => {
          if (!currImage) return null;

          const allImages: DisplayImage[] = imageColumns
            .reduce(
              (prev, curr) => [...prev, ...curr.items],
              [] as DisplayImage[],
            )
            .sort((a, b) => a.priority - b.priority);

          const currImageIndex = allImages.findIndex(img => img.url === currImage.url);
          if (dir === Direction.Forward) {
            if (currImageIndex + 1 === images.length) {
              return null;
            }
            if (currImageIndex + 1 === allImages.length) {
              return loadNextPage();
            }

            return allImages[currImageIndex + 1];
          }

          if (dir === Direction.Backward) {
            if (currImageIndex === 0) {
              return null;
            }

            return allImages[currImageIndex - 1];
          }

          return null;
        }}
      />
    ),
    [imageColumns],
  );

  const loadNextPage = (currModalImg?: Image): Image | null => {
    const allImages: DisplayImage[] = [...images]
      .filter(image => selectedFilter
        ? image.tags.includes(selectedFilter)
        : true
      )
      .sort((a, b) => a.priority - b.priority) as DisplayImage[];

    let imagesLoaded = 0;
    let foundUnloadedImage = false;
    const imagesToLoad: DisplayImage[] = [];
    for (let i = 0; i < allImages.length; i++) {
      const image = allImages[i];
      imagesToLoad.push(image);
      if (foundUnloadedImage) {
        imagesLoaded++;
      }

      if (!loadedImages.current[image.url]) {
        foundUnloadedImage = true;
        loadedImages.current[image.url] = true;

        if (imagesLoaded >= IMAGE_LIMIT) {
          break;
        }
      }
    }

    const newColumns = genNewColumns(screenType);

    while (imagesToLoad.length) {
      const nextBatch = imagesToLoad.splice(0, IMAGE_LIMIT);
      const colWidth = firstColDiv.current?.offsetWidth;
      for (const image of nextBatch) {
        const smallestColumn = newColumns.reduce(
          (prev, curr) => prev.height < curr.height ? prev : curr,
        );

        if (!image.actualHeight) {
          const origImgWidth = image.width;
          const percentChange = (origImgWidth - (colWidth || 0)) / origImgWidth;
          const actualHeight = image.height - (image.height * percentChange);
          image.actualHeight = actualHeight;
        }

        smallestColumn.items.push(image);
        image.height = image.actualHeight;
        smallestColumn.height += image.actualHeight;
      }
    }

    setImageColumns(newColumns);

    if (currModalImg) {
      const allImages: DisplayImage[] = imageColumns
        .reduce(
          (prev, curr) => [...prev, ...curr.items],
          [] as DisplayImage[],
        )
        .sort((a, b) => a.priority - b.priority);

      const currImageIndex = allImages.findIndex(img => img.url === currModalImg.url);

      if (currImageIndex + 1 === allImages.length) {
        return null;
      }

      return allImages[currImageIndex + 1];
    }

    return null;
  };

  useEffect(() => {
    loadNextPage();

    const callbackScroll = (): void => {
      if (Object.keys(loadedImages.current).length >= images.length) {
        return;
      }

      if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight * 0.9)) {
        loadNextPage();
      }
    };

    window.addEventListener('scroll', callbackScroll);
    return () => window.removeEventListener('scroll', callbackScroll);
  }, [screenType, selectedFilter]);

  useEffect(() => {
    if (screenType === ScreenType.mobile) {
      filterAnimation.start({
        opacity: 0,
        maxHeight: '0rem',
        transition: {
          duration: 0.35,
        }
      });
    } else {
      filterAnimation.start({
        opacity: 1,
        maxHeight: '10rem',
        transition: {
          duration: 0.35,
        }
      });
    }
  }, [screenType]);

  if (!images.length) {
    return (
      <>
        <p className={styles.errorText}>
          Something has broken on the server and my gallery could not be loaded. <br /> <br />
          I&apos;m so sorry for the inconvenience, please feel free to explore my social media accounts to see more of my work: <br />
        </p>
        <div className={styles.containerSocials}>
          <a href='https://www.instagram.com/azulilah/' target='_blank' rel='noreferrer'>
            Instagram
          </a>
          <br />
          <a href='https://azulila.tumblr.com/' target='_blank' rel='noreferrer'>
            Tumblr
          </a>
          <br />
          <a href='https://twitter.com/azulilah' target='_blank' rel='noreferrer'>
            Twitter
          </a>
        </div>
      </>
    );
  }

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.containerTitle}>
        {screenType === ScreenType.mobile &&
          <BurgerButton
            onClick={() => {
              if (!hideFilters) {
                filterAnimation.start({
                  opacity: 0,
                  maxHeight: '0rem',
                  transition: {
                    duration: 0.35,
                  },
                });
              } else {
                filterAnimation.start({
                  opacity: 1,
                  maxHeight: '10rem',
                  transition: {
                    duration: 0.35,
                  },
                });
              }
              setHideFilters(prev => !prev);
            }}
            isOpen={!hideFilters}
          />
        }
        <h2>Gallery</h2>
      </div>
      <motion.div
        className={styles.containerToggleFilters}
        initial={{opacity: 0, maxHeight: '0rem'}}
        animate={filterAnimation}
        exit={{opacity: 0, maxHeight: '0rem'}}
      >
        <Filters
          filters={tags}
          changeSelected={callbackChangeFilter}
        />
      </motion.div>
      <div className={styles.containerAllColumns}>
        {imageColumns.map((column, colIndex) => (
          <div
            key={colIndex}
            ref={colIndex === 0 ? firstColDiv : null}
            className={styles.containerColumn}
          >
            {column.items.map((image, imgIndex) => (
              <Fragment key={image.url}>
                <ImageItem
                  image={image}
                  clickImage={callbackClickImage}
                  dontLazyLoad={imgIndex === 0}
                />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

Gallery.title = 'Gallery';
Gallery.description = 'View my all my art here, or select specific categories';

export default Gallery;

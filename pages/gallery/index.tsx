import type { GetStaticProps } from 'next';
import type { Page, Image } from '../../interfaces';
import { ScreenType, Direction } from '../../interfaces';
import { useState, useRef, useEffect, useCallback, Fragment } from 'react';
import sql from 'mysql';
import DaoPortfolioImages from '../../dao/images';
import DaoTags from '../../dao/tags';
import { motion, useAnimation } from 'framer-motion';
import CustomAnimatePresence from '../../components/CustomAnimatePresence/CustomAnimatePresence';
import BurgerButton from '../../components/BurgerButton/BurgerButton';
import Filters from '../../components/Filters/Filters';
import ImageItem from '../../components/ImageItem/ImageItem';
import ImageModal from '../../components/ImageModal/ImageModal';
import useScreenType from '../../hooks/useScreenType';
import styles from './Gallery.module.css';

interface Props {
  images: Image[];
  tags: string[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const connSQL = sql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
  });

  const props: Props = {
    images: [],
    tags: [],
  };

  try {
    const daoPortfolioImages = new DaoPortfolioImages(connSQL);
    const daoTags = new DaoTags(connSQL);

    await Promise.all([
      daoPortfolioImages.getAll().then(res => props.images.push(...res.images)),
      daoTags.getAll().then(res => props.tags.push(...res)),
    ]);
  } catch (err) {
    console.log('err getting static props:', err);
  } finally {
    connSQL.destroy();
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

const c_imageLimit = 10;
const c_columnMap: {[key in ScreenType]: number} = {
  [ScreenType.mobile]: 1,
  [ScreenType.tablet]: 2,
  [ScreenType.desktop]: 3,
  [ScreenType.large]: 3,
  [ScreenType.extraLarge]: 3,
};
const c_genNewColumns = (screenType: ScreenType): Column[] => {
  const finalColumns: Column[] = [];
  for (let i = 0; i < c_columnMap[screenType]; i++) {
    finalColumns.push({items: [], height: 0});
  }
  return finalColumns;
}


const Gallery: Page<Props> = ({images, tags}) => {
  const screenType = useScreenType();
  const filterAnimation = useAnimation();

  const loadedImages = useRef<{[url: string]: boolean}>({});
  const firstColDiv = useRef<HTMLDivElement | null>(null);

  const [hideFilters, setHideFilters] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<Image | false | null>(null);
  const [imageColumns, setImageColumns] = useState<Column[]>(
    c_genNewColumns(screenType),
  );

  const callbackChangeFilter = useCallback((selected: string | null) => {
    setSelectedFilter(selected);
  }, []);

  const callbackClickImage = useCallback(
    (image: Image) => setSelectedImage(image),
    [],
  );

  const loadNextPage = (setNextImage: boolean = false) => {
    const allImages: DisplayImage[] = [...images]
      .filter(image => selectedFilter
        ? image.tags.includes(selectedFilter)
        : true
      )
      .sort((a, b) => a.priority - b.priority) as DisplayImage[];

    let imagesLoaded = 0;
    let foundUnloadedImage = false;
    let imageToShow: Image | undefined;
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
        if (setNextImage && !imageToShow) {
          imageToShow = image;
        }
        if (imagesLoaded >= c_imageLimit) {
          break;
        }
      }
    }

    const newColumns = c_genNewColumns(screenType);

    while (imagesToLoad.length) {
      const nextBatch = imagesToLoad.splice(0, c_imageLimit);
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

    if (imageToShow) {
      setSelectedImage(imageToShow);
    }
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
    <>
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
          {imageColumns.map((column, i) => (
            <div
              key={i}
              ref={i === 0 ? firstColDiv : null}
              className={styles.containerColumn}
            >
              {column.items.map(image => (
                <Fragment key={image.url}>
                  <ImageItem
                    image={image}
                    clickImage={callbackClickImage}
                  />
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
      <CustomAnimatePresence
        initial={false}
        exitBeforeEnter={true}
      >
        {selectedImage !== null &&
          <ImageModal
            image={selectedImage}
            close={() => setSelectedImage(null)}
            getNextImage={dir => {
              if (!selectedImage) return;

              const allImages: DisplayImage[] = imageColumns
                .reduce(
                  (prev, curr) => [...prev, ...curr.items],
                  [] as DisplayImage[],
                )
                .sort((a, b) => a.priority - b.priority);

              const currImageIndex = allImages.findIndex(img => img.url === selectedImage.url);
              if (dir === Direction.Forward) {
                if (currImageIndex + 1 === images.length) {
                  setSelectedImage(null);
                  return;
                }
                if (currImageIndex + 1 === allImages.length) {
                  setSelectedImage(false);
                  loadNextPage(true);
                  return;
                }

                setSelectedImage(allImages[currImageIndex + 1]);
              }

              if (dir === Direction.Backward) {
                if (currImageIndex === 0) {
                  setSelectedImage(null);
                  return;
                }

                setSelectedImage(allImages[currImageIndex - 1]);
              }
            }}
          />
        }
      </CustomAnimatePresence>
    </>
  );
};

Gallery.title = 'Gallery';

export default Gallery;

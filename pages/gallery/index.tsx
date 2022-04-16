import { useEffect, useState, useRef, Fragment } from 'react';
import type { Page, Image, ImagesData } from '../../interfaces/index';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { Direction } from '../../interfaces/index';
import CustomAnimatePresence from '../../components/CustomAnimatePresence/CustomAnimatePresence';
import useGetScreenType from '../../hooks/useScreenType';
import { ScreenType } from '../../interfaces/index';
import ImageItem from '../../components/ImageItem/ImageItem';
import ImageModal from '../../components/ImageModal/ImageModal';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import styles from './gallery.module.css';

interface QueryParams {
  page: number;
  filter: string[];
};
interface Column {
  items: DisplayImage[];
  height: number;
}
type DisplayImage = Image & {
  loadNum: number;
};

const c_intLimit: number = 10;
const c_columnMap: {[key in ScreenType]: number} = {
  [ScreenType.mobile]: 1,
  [ScreenType.tablet]: 2,
  [ScreenType.desktop]: 3,
};
const c_genNewColumns = (screenType: ScreenType): Column[] => {
  const finalColumns: Column[] = [];
  for (let i = 0; i < c_columnMap[screenType]; i++) {
    finalColumns.push({items: [], height: 0});
  }
  return finalColumns;
}

const Gallery: Page = () => {
  const screenType = useGetScreenType();
  const [imageColumns, setImageColumns] = useState<Column[]>(
    c_genNewColumns(screenType),
  );

  const [selectedImage, setSelectedImage] = useState<Image | null | false>(null);
  const [isLoading, _setIsLoading] = useState<boolean>(true);
  const [tags, setTags] = useState<string[]>([]);
  const [{page, filter}, setQueryParams] = useState<QueryParams>({
    page: 0,
    filter: [],
  });

  const totalCountRef = useRef<number | null>(null);
  const isLoadingRef = useRef<boolean>(true);
  const uniqueImages = useRef<{[key: string]: boolean}>({});
  const firstColDiv = useRef<HTMLDivElement | null>(null);

  const setIsLoading = (newLoadingState: boolean): void => {
    isLoadingRef.current = newLoadingState;
    _setIsLoading(newLoadingState);
  };

  const loadNextPage = (): void => {
    if (totalCountRef.current === null) return;

    if (
      Object.keys(uniqueImages.current).length < totalCountRef.current &&
      !isLoadingRef.current
    ) {
      setIsLoading(true);
      setQueryParams(prev => ({...prev, page: prev.page + 1}));
    }
  };

  useEffect(() => {
    const shouldUpdateSelected: boolean = selectedImage === false;
    axios({
      url: `/api/images?page=${page}&limit=${c_intLimit}&filter=${filter.join(',')}`,
      method: 'GET',
    })
      .then(({data}: {data: ImagesData}) => {
        const colWidth = firstColDiv.current?.offsetWidth;
        const newColumns = [...imageColumns];

        for (let i = 0; i < data.images.length; i++) {
          const image = data.images[i];

          if (uniqueImages.current[image.url]) {
            continue;
          }
          uniqueImages.current[image.url] = true;

          const origImgWidth = image.width;
          const percentChange = (origImgWidth - (colWidth || 0)) / origImgWidth;
          const actualHeight = image.height - (image.height * percentChange);

          const smallestColumn = newColumns.reduce(
            (prev, curr) => (prev.height < curr.height) ? prev : curr,
          );

          const displayImage: DisplayImage = {...image, loadNum: i};
          displayImage.height = actualHeight;
          smallestColumn.items.push(displayImage);
          smallestColumn.height += actualHeight;
        }

        setImageColumns(newColumns);
        setTags(data.tags);
        totalCountRef.current = data.totalCount;
        if (shouldUpdateSelected) {
          setSelectedImage(data.images[0]);
        }
      })
      .catch(console.dir)
      .finally(() => setIsLoading(false));
  }, [page, filter]);

  useEffect(() => {
    const callbackScroll = (): void => {
      if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight * 0.95)) {
        loadNextPage();
      }
    };

    window.addEventListener('scroll', callbackScroll);
    return () => window.removeEventListener('scroll', callbackScroll);
  }, []);

  useEffect(() => {
    const newColumns = c_genNewColumns(screenType);
    const allImages: DisplayImage[] = imageColumns
      .reduce(
        (prev, curr) => [...prev, ...curr.items],
        [] as DisplayImage[],
      )
      .sort((a, b) => a.priority - b.priority);

    if (!allImages.length) return;

    while (allImages.length) {
      const nextBatch = allImages.splice(0, 10);
      const colWidth = firstColDiv.current?.offsetWidth;
      for (const image of nextBatch) {
        const smallestColumn = newColumns.reduce(
          (prev, curr) => prev.height < curr.height ? prev : curr,
        );

        const origImgWidth = image.width;
        const percentChange = (origImgWidth - (colWidth || 0)) / origImgWidth;
        const actualHeight = image.height - (image.height * percentChange);

        smallestColumn.items.push(image);
        image.height = actualHeight;
        smallestColumn.height += image.height;
      }
    }

    setImageColumns(newColumns);
  }, [screenType]);

  return (
    <>
      <div className={styles.galleryContainer}>
        <h2>Gallery</h2>
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
                    delay={image.loadNum}
                    clickImage={image => setSelectedImage(image)}
                  />
                </Fragment>
              ))}
            </div>
          ))}
        </div>
        {isLoading &&
          <LoadingSpinner
            loadingText='Getting my latest work for you...'
            width={screenType === ScreenType.mobile ? '8rem' : '10rem'}
          />
        }
      </div>
      <CustomAnimatePresence
        initial={false}
        exitBeforeEnter={true}
        onExitComplete={() => null}
      >
        {selectedImage !== null &&
          <ImageModal
            image={selectedImage}
            close={() => setSelectedImage(null)}
            getNextImage={dir => {
              if (!selectedImage || !totalCountRef.current) return;

              const allImages: DisplayImage[] = imageColumns
                .reduce(
                  (prev, curr) => [...prev, ...curr.items],
                  [] as DisplayImage[],
                )
                .sort((a, b) => a.priority - b.priority);

              const currImageIndex = allImages.findIndex(img => img.url === selectedImage.url);
              if (dir === Direction.Forward) {
                if (currImageIndex + 1 === allImages.length) {
                  if (Object.keys(uniqueImages.current).length >= totalCountRef.current) {
                    setSelectedImage(null);
                    return;
                  }
                  setSelectedImage(false);
                  loadNextPage();
                  return;
                }

                setSelectedImage(allImages[currImageIndex + 1]);
              }

              if (dir === Direction.Backward) {
                if (currImageIndex - 1 === 0) {
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
Gallery.safeHydrate = true;

export default dynamic(
  () => Promise.resolve(Gallery),
  {
    ssr: false,
  },
);

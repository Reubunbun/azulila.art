import { useEffect, useState, useRef, Fragment } from 'react';
import axios from 'axios';
import type { Page, Image, ImagesData } from '../../interfaces/index';
import useGetScreenType from '../../hooks/useScreenType';
import { ScreenType } from '../../interfaces/index';
import ImageItem from '../../components/ImageItem/ImageItem';
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

  const [tags, setTags] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [{page, filter}, setQueryParams] = useState<QueryParams>({
    page: 0,
    filter: [],
  });

  const initialLoad = useRef<boolean>(true);
  const uniqueImages = useRef<{[key: string]: boolean}>({});
  const firstColDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    axios({
      url: `/api/images?page=${page}&limit=${c_intLimit}&filter=${filter.join(',')}`,
      method: 'GET',
    })
      .then(({data}: {data: ImagesData}) => {
        const newColumns = c_genNewColumns(screenType);
        const colWidth = firstColDiv.current?.offsetWidth;

        for (let i = 0; i < data.images.length; i++) {
          const image = data.images[i];

          if (uniqueImages.current[image.url]) {
            continue;
          }
          uniqueImages.current[image.url] = true;

          const intOrigImgWidth = image.width;
          const flPercentChange = (intOrigImgWidth - (colWidth || 0)) / intOrigImgWidth;
          const actualHeight = image.height - (image.height * flPercentChange);

          const smallestColumn = newColumns.reduce(
            (prev, curr) => (prev.height < curr.height) ? prev : curr,
          );

          const displayImage: DisplayImage = {...image, loadNum: i};
          smallestColumn.items.push(displayImage);
          smallestColumn.height += actualHeight;
        }

        setImageColumns(newColumns);
        setTags(data.tags);
        setTotalCount(data.totalCount);
      })
      .catch(console.dir);
  }, [page, filter]);

  return (
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
                  clickImage={() => {}}
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

export default Gallery;

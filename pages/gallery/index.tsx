import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Page, Image, ImagesData } from '../../interfaces/index';
import styles from './gallery.module.css';

const c_intLimit = 10;
interface QueryParams {
  page: number;
  filter: string[];
};

const Gallery: Page = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [{page, filter}, setQueryParams] = useState<QueryParams>({
    page: 0,
    filter: [],
  });

  useEffect(() => {
    axios({
      url: `/api/images?page=${page}&limit=${c_intLimit}&filter=${filter.join(',')}`,
      method: 'GET',
    })
      .then(({data}: {data: ImagesData}) => {
        setImages(data.images);
        setTags(data.tags);
        setTotalCount(data.totalCount);
      })
      .catch(console.dir);
  }, [page, filter]);

  return (
    <div className={styles.galleryContainer}>
      <h2>Gallery</h2>
      <div className={styles.containerImages}>
        <pre>
          {JSON.stringify(images, null, 2)}
        </pre>
        <p>{tags.join(', ')}</p>
        <p>{totalCount}</p>
      </div>
    </div>
  );
};
Gallery.title = 'Gallery';

export default Gallery;

import { type FC, useState, useRef, useEffect, memo } from 'react';
import { ProductGroup } from 'interfaces';
import { motion, useAnimation } from 'framer-motion';
import LazyLoad from 'react-lazy-load';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import styles from './Product.module.css';

interface Props extends ProductGroup {
  onClick: (groupId: number) => void;
}

const Product: FC<Props> = ({
  name,
  groupId,
  imageUrl,
  products,
  onClick,
}) => {
  const imgAnimation = useAnimation();
  const placeholderAnimation = useAnimation();
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const localImgRef = useRef<HTMLImageElement>(null);

  const allPrices = products.map(product => product.actualPrice);
  const minPrice = Math.min(...allPrices).toFixed(2);
  const maxPrice = Math.max(...allPrices).toFixed(2);

  const imgLoadCallback = () => {
    imgAnimation.start({
      opacity: 1,
      transition: {
        duration: 0.8,
        type: 'tween',
      },
    });
    placeholderAnimation.start({
      opacity: 0,
      transition: {
        duration: 0.8,
        type: 'tween',
      },
    });
    setHasLoaded(true);
  };

  const imgComponent = <motion.img
    initial={{opacity: 0}}
    animate={imgAnimation}
    exit={{opacity: 0}}
    className={styles.imageItem}
    src={imageUrl}
    alt={name}
    ref={localImgRef}
    onClick={e => {
      e.stopPropagation();
      onClick(groupId);
    }}
    onLoad={imgLoadCallback}
  />;

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (hasLoaded) {
        clearInterval(intervalId);
        return;
      }

      if (!localImgRef?.current) {
        return;
      }

      if (
        localImgRef.current.complete &&
        localImgRef.current.naturalHeight !== 0
      ) {
        imgLoadCallback();
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [hasLoaded]);


  return (
    <div className={styles.containerImageItem}>
      <LazyLoad className={styles.lazyLoadWrapper} offset={100}>
        {imgComponent}
      </LazyLoad>
      <div className={styles.imageHover} onClick={() => onClick(groupId)}>
        <p className={styles.imageHoverText}>
          <span className={styles.bold}>{name}</span>
          <br className={styles.lineBreak}/>
          {` ${minPrice}$ - ${maxPrice}$`}
        </p>
      </div>
      {!hasLoaded &&
        <motion.div
          initial={{opacity: 1}}
          animate={placeholderAnimation}
          exit={{opacity: 0}}
          className={styles.placeholder}
        >
          <LoadingSpinner loadingText={''} />
        </motion.div>
      }
    </div>
  );
};

export default memo(Product);

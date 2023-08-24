import { type FC, useState, useRef, useEffect, memo } from 'react';
import LazyLoad from 'react-lazy-load';
import { motion, useAnimation } from 'framer-motion';
import { type ProductGroup } from 'interfaces';
import { useUIContext } from 'context/UIContext';
import ProductModal from 'components/ProductModal/ProductModal';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import styles from './Product.module.css';

interface Props extends ProductGroup {
  hasLoadedBefore: boolean;
  onImageLoad: () => void;
}

const Product: FC<Props> = props => {
  const {
    name,
    imageUrl,
    products,
    hasLoadedBefore,
    onImageLoad,
  } = props;

  const imgAnimation = useAnimation();
  const placeholderAnimation = useAnimation();
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const localImgRef = useRef<HTMLImageElement>(null);
  const { setModalContent } = useUIContext();

  const allPrices = products.map(product => product.actualPrice);
  const minPrice = Math.min(...allPrices).toFixed(2);
  const maxPrice = Math.max(...allPrices).toFixed(2);

  const clickProduct = () => {
    setModalContent(
      <ProductModal
        productGroup={props}
        close={() => setModalContent(null)}
      />
    );
  };

  const imgLoadCallback = () => {
    if (hasLoadedBefore) return;

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
    onImageLoad();
  };

  const imgComponent = <img
    className={styles.imageItem}
    src={imageUrl}
    alt={name}
    ref={localImgRef}
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
    <div className={styles.containerImageItem} onClick={clickProduct}>
      <LazyLoad className={styles.lazyLoadWrapper} offset={100}>
        <motion.div
          initial={{ opacity: hasLoadedBefore ? undefined : 0 }}
          animate={imgAnimation}
          exit={{ opacity: hasLoadedBefore ? undefined : 0 }}
        >
          {imgComponent}
          <div className={styles.imageHover}>
            <p className={styles.imageHoverText}>
              <span className={styles.bold}>{name}</span>
              <br className={styles.lineBreak}/>
              {` ${minPrice}$ - ${maxPrice}$`}
            </p>
          </div>
        </motion.div>
      </LazyLoad>
      {!hasLoaded && !hasLoadedBefore &&
        <motion.div
          initial={{ opacity: 1 }}
          animate={placeholderAnimation}
          exit={{ opacity: 0 }}
          className={styles.placeholder}
        >
          <LoadingSpinner loadingText={''} />
        </motion.div>
      }
    </div>
  );
};

export default memo(Product);

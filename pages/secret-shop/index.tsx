import { type Page } from 'interfaces';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useShopContext } from 'context/ShopContext';
import Filters from 'components/Filters/Filters';
import AnimatePresence from 'components/CustomAnimatePresence/CustomAnimatePresence';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import Product from 'components/Product/Product';
import styles from './shop.module.css';

const Shop: Page = () => {
  const {
    madeInitialRequest,
    fetchProducts,
    products,
    categories,
  } = useShopContext();
  const [networkError, setNetworkError] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loadedProducts, setLoadedProducts] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchProducts().catch(() => setNetworkError(true));
  }, [fetchProducts]);

  if (networkError) {
    return (
      <p style={{
        width: '100%',
        marginTop: 0,
        textAlign: 'center'
      }}>
        There was a network error, please try refreshing the page.
      </p>
    );
  }

  if (!madeInitialRequest) {
    return (
      <div>
        <LoadingSpinner
          loadingText='Loading Products...'
          width='9rem'
        />
      </div>
    );
  }

  return (
    <div className={styles.shopPageContainer}>
      <div>
        <Filters
          filters={categories}
          changeSelected={setSelectedCategory}
          throttle={300}
        />
      </div>
      <div className={styles.productListContainer}>
        <AnimatePresence>
          {products
            .filter(
              ({ mainCategory }) => selectedCategory ? mainCategory === selectedCategory : true
            )
            .map(product =>
              <motion.div
                layout
                transition={{
                  duration: 0.2,
                  ease: 'easeOut',
                }}
                initial={{ scale: loadedProducts.has(product.groupId) ?  0 : undefined }}
                animate={{ scale: loadedProducts.has(product.groupId) ?  1 : undefined }}
                exit={{ scale: loadedProducts.has(product.groupId) ?  0 : undefined }}
                className={styles.productContainer}
                key={product.groupId}
              >
                <Product
                  {...product}
                  onImageLoad={
                    () => setLoadedProducts(
                      prev => new Set([...prev.values(), product.groupId])
                    )
                  }
                  hasLoadedBefore={loadedProducts.has(product.groupId)}
                />
              </motion.div>
            )
          }
        </AnimatePresence>
      </div>
    </div>
  );
};

Shop.title = 'Shop';
Shop.description = 'Welcome to my shop';

export default Shop;

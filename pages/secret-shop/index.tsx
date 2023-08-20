import { type Page, type ProductGroup, ScreenType } from 'interfaces';
import { Fragment, useEffect, useState } from 'react';
import useScreenType from 'hooks/useScreenType';
import { useShopContext } from 'context/ShopContext';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import Product from 'components/Product/Product';
import styles from './shop.module.css';

const COLUMN_MAP: {[key in ScreenType]: number} = {
  [ScreenType.mobile]: 1,
  [ScreenType.tablet]: 2,
  [ScreenType.desktop]: 3,
  [ScreenType.large]: 3,
  [ScreenType.extraLarge]: 3,
};
const genNewColumns = (screenType: ScreenType): ProductGroup[][] => {
  const finalColumns: ProductGroup[][] = [];
  for (let i = 0; i < COLUMN_MAP[screenType]; i++) {
    finalColumns.push([]);
  }
  return finalColumns;
}

const Shop: Page = () => {
  const screenType = useScreenType();
  const {
    madeInitialRequest,
    fetchProducts,
    products,
    categories,
  } = useShopContext();
  const [networkError, setNetworkError] = useState<boolean>(false);
  const [productColumns, setProductColumns] = useState<ProductGroup[][]>([]);

  useEffect(() => {
    fetchProducts().catch(() => setNetworkError(true));
  }, []);

  useEffect(() => {
    const columns = genNewColumns(screenType);
    const orderedProducts = Array.from(products).sort((a, b) => b.priority - a.priority);

    let columnIndex: number = 0;
    for (const productGroup of orderedProducts) {
      columns[columnIndex].push(productGroup);
      if (++columnIndex > columns.length - 1) {
        columnIndex = 0;
      }
    }

    setProductColumns(columns);
  }, [screenType, products]);

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
    <div className={styles.listingsWrapper}>
      {productColumns.map((column, i) =>
        <div
          key={i}
          className={styles.listingsColumn}
          style={{
            width: productColumns.length === 3
              ? '25vw'
              : productColumns.length === 2
                ? '45vw'
                : 'min(90vw, 30rem)'
          }}
        >
          {column.map(product =>
            <Fragment key={product.groupId}>
              <Product {...product}/>
            </Fragment>
          )}
        </div>
      )}
    </div>
  );
};

Shop.title = 'Shop';
Shop.description = 'Welcome to my shop';

export default Shop;

import { type Page, type ProductGroup, ScreenType } from 'interfaces';
import type { GetStaticProps } from 'next';
import { Fragment, useEffect, useState } from 'react';
import { Client as PGClient } from 'pg';
import useScreenType from 'hooks/useScreenType';
import Product from 'components/Product/Product';
import DaoProducts from 'dao/Products';
import styles from './shop.module.css';

interface Props {
  products: ProductGroup[],
  categories: string[],
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const pgClient = new PGClient({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      ssl: { rejectUnauthorized: false },
  });

  const props: Props = {
    products: [],
    categories: [],
  };

  try {
      await pgClient.connect();
      const daoProducts = new DaoProducts(pgClient);
      const { productGroups } = await daoProducts.getAll();

      props.products.push(...productGroups);
      props.categories.push(
        ...productGroups.map(({ mainCategory }) => mainCategory),
      );
  } catch (err) {
      console.log(err);
  } finally {
      await pgClient.end();
  }

  return {
    props,
    revalidate: 300,
  };
};

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

const Shop: Page<Props> = ({ products, categories }) => {
  const screenType = useScreenType();

  const [productColumns, setProductColumns] = useState<ProductGroup[][]>([]);

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

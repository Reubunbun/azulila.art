import type { Page, ProductGroup } from 'interfaces';
import type { GetStaticProps } from 'next';
import { Fragment } from 'react';
import { Client as PGClient } from 'pg';
import ProductType from 'components/Product/Product';
import DaoProducts from 'dao/Products';

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


const Shop: Page<Props> = ({ products, categories }) => {
  return (
    <>
      {products.map(product =>
        <Fragment key={product.groupId}>
          <ProductType
            {...product}
            onClick={() => {}}
          />
        </Fragment>
      )}
    </>
  );
};

Shop.title = 'Shop';
Shop.description = 'Welcome to my shop';

export default Shop;

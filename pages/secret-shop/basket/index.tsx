import { Fragment } from 'react';
import type { Page } from 'interfaces';
import { useShopContext } from 'context/ShopContext';
import BasketItem from 'components/BasketItem/BasketItem';
import styles from './basket.module.css';

const Basket: Page = () => {
  const { basket } = useShopContext();

  return (
    <>
      {basket.products.map(basketItem =>
        <Fragment key={basketItem.productId}>
          <BasketItem {...basketItem} />
        </Fragment>
      )}
    </>
  );
};

Basket.title = 'Basket';
Basket.description = 'Your Basket';

export default Basket;

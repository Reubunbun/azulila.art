import type { Page } from 'interfaces';
import { useShopContext } from 'context/ShopContext';

const Basket: Page = () => {
  const { getBasket } = useShopContext();

  return (
    <pre>{JSON.stringify(getBasket(), null, 2)}</pre>
  );
};

Basket.title = 'Basket';
Basket.description = 'Your Basket';

export default Basket;

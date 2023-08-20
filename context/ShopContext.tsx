import {
  type FC,
  type ReactNode,
  type Dispatch,
  createContext,
  useState,
  useContext,
  useReducer,
} from 'react';
import axios from 'axios'
import { ProductGroup, Product, ProductsResult } from 'interfaces';

type ProductId = number;
type Quantity = number;
type SelectedProducts = Record<ProductId, Quantity>;

type ProductAction =
  | { type: 'ADD-PRODUCT', payload: { id: ProductId, quantity: Quantity } }
  | { type: 'RREMOVE-PRODUCT', payload: ProductId }
  | { type: 'QUANTITY', payload: { id: ProductId, quantity: Quantity } };

const reducer = (state: SelectedProducts, action: ProductAction) : SelectedProducts => {
  switch (action.type) {
    case 'ADD-PRODUCT':
      return {
        ...state,
        [action.payload.id]: action.payload.quantity,
      };
    case 'RREMOVE-PRODUCT':
      const { [action.payload]: removedProduct, ...remainingProducts } = state;
      return { ...remainingProducts };
    case 'QUANTITY':
      return {
        ...state,
        [action.payload.id]: state[action.payload.id] + action.payload.quantity,
      };
    default:
      return state;
  }
};

interface Basket {
  totalPrice: number;
  actualTotalPrice: number;
  groups: {
    groupId: number;
    name: string;
    groupPrice: number;
    actualGroupPrice: number;
    products: {
      productId: number;
      name: string;
      price: number;
      actualPrice: number;
      quantity: number;
    }[];
  }[];
}

interface ShopContextType extends ProductsResult {
  madeInitialRequest: boolean;
  fetchProducts: () => Promise<void>;
  dispatchProduct: Dispatch<ProductAction>;
  getBasket: () => Basket;
  selectedProducts: SelectedProducts;
}

const ShopContext = createContext<ShopContextType>({
  products: [],
  categories: [],
  madeInitialRequest: false,
  fetchProducts: async () => {},
  dispatchProduct: () => {},
  getBasket: () => ({
    totalPrice: 0,
    actualTotalPrice: 0,
    groups: [],
  }),
  selectedProducts: {},
});

export const ShopStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [madeInitialRequest, setMadeInitialRequest] = useState<boolean>(false);
  const [shopServerData, setShopServerData] = useState<ProductsResult | null>(null);
  const [selectedProducts, dispatch] = useReducer(reducer, {});

  const fetchProducts = async () => {
    if (madeInitialRequest) return;

    const { data } = await axios({
      method: 'GET',
      url: '/api/shop',
    }) as { data: ProductsResult };

    setMadeInitialRequest(true);
    setShopServerData(data);
  };

  const getBasket = () : Basket => {
    const basket: Basket = {
      totalPrice: 0,
      actualTotalPrice: 0,
      groups: [],
    };

    if (!shopServerData) {
      return basket;
    }

    const selectedProductIds = Object.keys(selectedProducts).map(Number);

    for (const selectedProductId of selectedProductIds) {
      let productGroup: ProductGroup | null = null;
      let product: Product | null = null;

      for (const group of shopServerData.products) {
        const foundProduct = group.products.find(
          ({ productId }) => productId === selectedProductId,
        );
        if (foundProduct) {
          product = foundProduct;
          productGroup = group;
          break;
        }
      }

      if (productGroup === null || product === null) {
        throw new Error('Cant find product');
      }

      const quantity = selectedProducts[selectedProductId];
      const priceForProduct = product.price * quantity;
      const actualPriceForProduct = product.actualPrice * quantity;

      const basketProduct = {
        productId: product.productId,
        name: product.name,
        price: priceForProduct,
        actualPrice: actualPriceForProduct,
        quantity,
      };

      const basketGroup = basket.groups.find(
        ({ groupId }) => groupId === productGroup!.groupId,
      );
      if (!basketGroup) {
        basket.groups.push({
          groupId: productGroup.groupId,
          name: productGroup.name,
          groupPrice: priceForProduct,
          actualGroupPrice: actualPriceForProduct,
          products: [basketProduct],
        });
      } else {
        basketGroup.products.push(basketProduct);
        basketGroup.groupPrice += priceForProduct;
        basketGroup.actualGroupPrice += actualPriceForProduct;
      }
    }

    basket.totalPrice = basket.groups.reduce(
      (prev: number, curr) => prev + curr.groupPrice,
      0,
    );
    basket.actualTotalPrice = basket.groups.reduce(
      (prev: number, curr) => prev + curr.actualGroupPrice,
      0,
    );

    return basket;
  };

  return (
    <ShopContext.Provider
      value={{
        products: shopServerData ? shopServerData.products : [],
        categories: shopServerData ? shopServerData.categories : [],
        madeInitialRequest,
        fetchProducts,
        dispatchProduct: dispatch,
        getBasket,
        selectedProducts,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export function useShopContext() {
  return useContext(ShopContext);
}

export default ShopContext;

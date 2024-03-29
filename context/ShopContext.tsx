import {
  type FC,
  type ReactNode,
  type Dispatch,
  createContext,
  useState,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import axios from 'axios'
import { type ProductsResult } from 'interfaces';

type ProductId = number;
type Quantity = number;
type SelectedProducts = Record<ProductId, Quantity>;

type ProductAction =
  | { type: 'ADD-PRODUCT', payload: { id: ProductId, quantity: Quantity } }
  | { type: 'RREMOVE-PRODUCT', payload: ProductId }
  | { type: 'QUANTITY', payload: { id: ProductId, quantity: Quantity } }
  | { type: 'RESET' };

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
        [action.payload.id]: action.payload.quantity,
      };
    case 'RESET':
      return {};
    default:
      return state;
  }
};

export interface BasketItem {
  groupId: number;
  productId: number;
  imageURL: string;
  groupName: string;
  productName: string;
  price: number;
  totalPrice: number;
  quantity: number;
};

interface Basket {
  totalPrice: number;
  shippingUS: number;
  shippingInt: number;
  products: BasketItem[],
}

interface ShopContextType extends ProductsResult {
  madeInitialRequest: boolean;
  fetchProducts: () => Promise<void>;
  dispatchProduct: Dispatch<ProductAction>;
  basket: Basket;
  selectedProducts: SelectedProducts;
}

const ShopContext = createContext<ShopContextType>({
  products: [],
  categories: [],
  madeInitialRequest: false,
  fetchProducts: async () => {},
  dispatchProduct: () => {},
  basket: {
    totalPrice: 0,
    shippingUS: 0,
    shippingInt: 0,
    products: [],
  },
  selectedProducts: {},
});

export const ShopStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [madeInitialRequest, setMadeInitialRequest] = useState<boolean>(false);
  const [shopServerData, setShopServerData] = useState<ProductsResult | null>(null);
  const [selectedProducts, dispatch] = useReducer(reducer, {});
  const [basket, setBasket] = useState<Basket>({
    totalPrice: 0,
    shippingUS: 0,
    shippingInt: 0,
    products: [],
  });

  const fetchProducts = async () => {
    if (madeInitialRequest) return;

    const { data } = await axios({
      method: 'GET',
      url: '/api/shop',
    }) as { data: ProductsResult };

    setMadeInitialRequest(true);
    setShopServerData(data);
  };

  useEffect(() => {
    const basket: Basket = {
      totalPrice: 0,
      shippingUS: 0,
      shippingInt: 0,
      products: [],
    };

    if (!shopServerData) {
      return;
    }

    const selectedProductIds = Object.keys(selectedProducts).map(Number);
    const allUSShipping = [];
    const allIntShipping = [];

    for (const productId of selectedProductIds) {
      const foundGroup = shopServerData.products.find(group =>
        group.products.some(product => product.productId === productId),
      );

      if (!foundGroup) {
        throw new Error(`Couldn't find group containing product with id: ${productId}`);
      }

      allUSShipping.push(foundGroup.shippingUS);
      allIntShipping.push(foundGroup.shippingInt);

      const foundProduct = foundGroup.products.find(
        product => product.productId === productId,
      );

      if (!foundProduct) {
        throw new Error(`Couldn't find product with id: ${productId}`);
      }

      const quantity = selectedProducts[productId];

      const totalPrice = foundProduct.price * quantity;

      basket.products.push({
        groupId: foundGroup.groupId,
        productId: foundProduct.productId,
        imageURL: foundGroup.imageUrl,
        groupName: foundGroup.name,
        productName: foundProduct.name,
        price: foundProduct.price,
        totalPrice,
        quantity,
      });

      basket.totalPrice += totalPrice;
    }

    basket.shippingUS = Math.max(...allUSShipping);
    basket.shippingInt = Math.max(...allIntShipping);

    setBasket(basket);
  }, [selectedProducts, shopServerData]);

  return (
    <ShopContext.Provider
      value={{
        products: shopServerData ? shopServerData.products : [],
        categories: shopServerData ? shopServerData.categories : [],
        madeInitialRequest,
        fetchProducts,
        dispatchProduct: dispatch,
        basket,
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

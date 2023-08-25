import { type FC } from 'react';
import { type BasketItem, useShopContext } from 'context/ShopContext';
import styles from './BasketItem.module.css';

const BasketItem: FC<BasketItem> = ({
  imageURL,
  groupName,
  productId,
  productName,
  price,
  actualPrice,
  totalPrice,
  actualTotalPrice,
  quantity,
}) => {
  const { dispatchProduct } = useShopContext();
  const isSale = price !== actualPrice;

  return (
    <div>
      <div>
        <img
          src={imageURL}
          alt={groupName}
        />
        <div>
          <p>{groupName}</p>
          <p>
            {productName} -
            {isSale
              ? <span><s>{price}$</s></span>
              : <></>
            }
            {` ${actualPrice}`}$
          </p>
          <span
            onClick={() => dispatchProduct({
              type: 'RREMOVE-PRODUCT',
              payload: productId,
            })}
          >
            Remove
          </span>
        </div>
        <div>
          <input
            type='number'
            value={quantity}
            onChange={e => dispatchProduct({
              type: 'QUANTITY',
              payload: { id: productId, quantity: Number(e.target.value) },
            })}
          />
          <p>
            {isSale
              ? <span><s>{totalPrice}$</s> </span>
              : <></>
            }
            {actualTotalPrice}$
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasketItem;

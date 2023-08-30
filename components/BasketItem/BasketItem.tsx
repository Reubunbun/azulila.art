import { type FC } from 'react';
import { type BasketItem, useShopContext } from 'context/ShopContext';
import sharedStyles from 'styles/shop-shared.module.css';
import styles from './BasketItem.module.css';

interface Props extends BasketItem {
  isFirst: boolean;
  isLast: boolean;
}

const BasketItem: FC<Props> = ({
  imageURL,
  groupName,
  productId,
  productName,
  price,
  actualPrice,
  totalPrice,
  actualTotalPrice,
  quantity,
  isFirst,
  isLast,
}) => {
  const { dispatchProduct } = useShopContext();
  const isSale = price !== actualPrice;

  return (
    <div
      className={styles.itemWrapper}
      style={{
        borderTop: '2px solid #ffe3f1',
        borderBottom: isLast ? '2px solid #ffe3f1' : undefined,
        borderTopRightRadius: isFirst ? 'var(--b-radius)' : undefined,
        borderTopLeftRadius: isFirst ? 'var(--b-radius)' : undefined,
        borderBottomLeftRadius: isLast ? 'var(--b-radius)' : undefined,
        borderBottomRightRadius: isLast ? 'var(--b-radius)' : undefined,
      }}
    >
      <div className={styles.itemContainer}>
        <img
          src={imageURL}
          alt={groupName}
          className={styles.image}
        />
        <div className={styles.productInfoWrapper}>
          <p className={styles.groupNameText}>{groupName}</p>
          <p>
            {productName} -
            {isSale
              ? <span> <s>{price}$</s></span>
              : <></>
            }
            {` ${actualPrice}`}$
          </p>
          <span
            className='link'
            onClick={() => dispatchProduct({
              type: 'RREMOVE-PRODUCT',
              payload: productId,
            })}
          >
            Remove
          </span>
        </div>
        <div className={styles.quantityContainer}>
          <input
            className={sharedStyles.numericalInput}
            type='number'
            value={quantity}
            step={1}
            onChange={e => dispatchProduct({
              type: 'QUANTITY',
              payload: { id: productId, quantity: Number(e.target.value) },
            })}
          />
          <p className={styles.priceText}>
            {isSale
              ? <span className={styles.priceText}><s>{totalPrice}$</s> </span>
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

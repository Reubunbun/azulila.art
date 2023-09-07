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
  totalPrice,
  quantity,
  isFirst,
  isLast,
}) => {
  const { dispatchProduct } = useShopContext();

  return (
    <div
      className={`${styles.itemWrapper} ${sharedStyles.infoBg}`}
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
            {productName} - {price}$
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
            onChange={e => {
              const newQuantity = e.target.value;
              if (/[^0-9]/.test(newQuantity)) {
                return;
              }

              dispatchProduct({
                type: 'QUANTITY',
                payload: { id: productId, quantity: Number(newQuantity) },
              });
            }}
          />
          <p className={styles.priceText}>
            {totalPrice}$
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasketItem;

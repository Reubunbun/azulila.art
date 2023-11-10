import { type RefObject, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { Page } from 'interfaces';
import { motion } from 'framer-motion';
import { useShopContext } from 'context/ShopContext';
import AnimatePresence from 'components/CustomAnimatePresence/CustomAnimatePresence';
import styles from './basket.module.css';
import sharedStyles from 'styles/shop-shared.module.css';

const Basket: Page = () => {
  const router = useRouter();
  const { basket, products, dispatchProduct } = useShopContext();
  const warningRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    warningRefs.current = warningRefs.current.slice(0, basket.products.length);
  }, [basket.products]);

  if (!basket.products.length) {
    return (
      <p style={{
        width: '100%',
        marginTop: '1rem',
        textAlign: 'center',
        fontSize: '1.5em'
      }}>
        Theres&apos;s nothing in your basket, head to <span className='link' onClick={() => router.push('/shop')}>products</span> to start shopping!
      </p>
    );
  }

  const goToCheckout = () => {
    let foundWarning = false;
    let scrollToDiv: HTMLDivElement | undefined;

    for (let i = 0; i < basket.products.length; i++) {
      const basketItem = basket.products[i];
      const maxStock = products
        .find(p => p.groupId === basketItem.groupId)
        ?.products
        .find(p => p.productId === basketItem.productId)
        ?.stock!

      if (basketItem.quantity < 1 || basketItem.quantity > maxStock) {
        warningRefs.current[i]?.classList.remove('warning');
        void warningRefs.current[i]?.offsetWidth;
        warningRefs.current[i]?.classList.add('warning');

        foundWarning = true;
        scrollToDiv = warningRefs.current[i]!;
      }
    }

    if (foundWarning) {
      if (scrollToDiv) {
        window.scrollTo({
          top: scrollToDiv.getBoundingClientRect().top + window.scrollY - 150,
          behavior: 'smooth',
        });
      }

      return;
    }

    router.push('/shop/basket/checkout');
  }

  return (
    <>
      <p className={styles.productInfoText}>
        You have {basket.products.length} {basket.products.length === 1 ? 'product' : 'products'} in your basket:
      </p>
      <div className={styles.productsOuterContainer}>
        <div className={styles.productsInnerContainer}>
          <AnimatePresence>
            {basket.products.map((basketItem, i) => {
              const isLast = i === basket.products.length - 1;
              const isFirst = i === 0;

              const maxStock = products
                .find(p => p.groupId === basketItem.groupId)
                ?.products
                .find(p => p.productId === basketItem.productId)
                ?.stock!

              return (
                <motion.div
                  key={basketItem.productId}
                  initial={false}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <div
                    className={`${styles.basketItemWrapper} ${sharedStyles.infoBg}`}
                    style={{
                      borderTop: '2px solid #ffe3f1',
                      borderBottom: isLast ? '2px solid #ffe3f1' : undefined,
                      borderTopRightRadius: isFirst ? 'var(--b-radius)' : undefined,
                      borderTopLeftRadius: isFirst ? 'var(--b-radius)' : undefined,
                      borderBottomLeftRadius: isLast ? 'var(--b-radius)' : undefined,
                      borderBottomRightRadius: isLast ? 'var(--b-radius)' : undefined,
                    }}
                  >
                    <div className={styles.basketItemContainer}>
                      <img
                        src={basketItem.imageURL}
                        alt={basketItem.groupName}
                        className={styles.image}
                      />
                      <div className={styles.productInfoWrapper}>
                        <p className={styles.groupNameText}>
                          {basketItem.groupName}
                        </p>
                        <p>
                          {basketItem.productName} - {basketItem.price}$
                        </p>
                        <span
                          className='link'
                          onClick={() => dispatchProduct({
                            type: 'RREMOVE-PRODUCT',
                            payload: basketItem.productId,
                          })}
                        >
                          Remove
                        </span>
                      </div>
                      <div className={styles.quantityContainer}>
                        <div
                          className={styles.warningContainer}
                          ref={el => warningRefs.current![i] = el}
                        >
                          <p style={{ display: basketItem.quantity === 0 ? undefined : 'none' }}>
                            You must purchase at least one
                          </p>
                          <p style={{ display: basketItem.quantity > maxStock ? undefined : 'none' }}>
                            Only {maxStock} left in stock, please select lower
                          </p>
                        </div>
                        <input
                          className={sharedStyles.numericalInput}
                          type='text'
                          value={basketItem.quantity}
                          onChange={e => {
                            const newQuantity = e.target.value;
                            if (/[^0-9]/.test(newQuantity)) {
                              return;
                            }

                            dispatchProduct({
                              type: 'QUANTITY',
                              payload: { id: basketItem.productId, quantity: Number(newQuantity) },
                            });
                          }}
                        />
                        <p className={styles.priceText}>
                          {basketItem.totalPrice}$
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        <div className={`${styles.checkoutContainer} ${sharedStyles.infoBg}`}>
          <p>Subtotal - {basket.totalPrice}$</p>
          <button
            className={sharedStyles.checkoutButton}
            onClick={goToCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};

Basket.title = 'Basket';
Basket.description = 'Your Basket';

export default Basket;

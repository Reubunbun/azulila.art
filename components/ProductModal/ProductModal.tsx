import { type FC, useState } from 'react';
import { motion } from 'framer-motion';
import type { ProductGroup, Product } from 'interfaces';
import { useShopContext } from 'context/ShopContext';
import ModalBackdrop from 'components/ModalBackdrop/ModalBackdrop';
import sharedStyles from 'styles/shop-shared.module.css';
import styles from './ProductModal.module.css';

interface Props {
  productGroup: ProductGroup,
  close: () => void,
}

const strikethroughText = (input: string) =>
  [...input].map(char => `${char}\u0336`).join('')

const MAX_ALLOWED_QUANTITY = Infinity;

const ProductModal: FC<Props> = ({ productGroup, close }) => {
  const [selectedProductId, setSelectedProductId] = useState<number>(
    productGroup.products[0].productId,
  );
  const [quantity, setQuantity] = useState<number>(1);

  const selectedProduct: Product = productGroup.products.find(
    product => selectedProductId === product.productId,
  )!;

  const { dispatchProduct } = useShopContext();

  const addProductToBasket = () => {
    dispatchProduct({
      type: 'ADD-PRODUCT',
      payload: { id: selectedProduct.productId, quantity: quantity },
    });
    close();
  };

  return (
    <ModalBackdrop close={close} key='modal'>
      <motion.div
        onClick={e => e.stopPropagation()}
        className={styles.containerProductModal}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
      >
        <div className={styles.containerCloseBtn}>
          <button
            onClick={close}
            className={styles.closeBtn}
          >
            <p>X</p>
          </button>
        </div>
        <div className={styles.containerDesktopSplit}>
          <div className={styles.containerMainContent}>
            <div>
              <h1>{productGroup.name}</h1>
              <p className={styles.productDescription}>
                {productGroup.description}
              </p>
            </div>
            <div>
              {productGroup.products.length > 1 &&
                <div className={styles.containerSelect}>
                  <p>Select Option:</p>
                  <select
                    className={sharedStyles.select}
                    onChange={e => setSelectedProductId(Number(e.target.value))}
                  >
                    {productGroup.products.map(product =>
                      <option
                        key={product.productId}
                        value={product.productId}
                        disabled={product.stock <= 0}
                      >
                        {
                          `${product.name} - ${
                            `${
                                product.offer
                                  ? strikethroughText(`${product.price}$`)
                                  : ''
                              } ${product.actualPrice}$`.trim()}`
                          }
                      </option>
                    )}
                  </select>
                </div>
              }
              <div className={styles.containerQuantityAndPrice}>
                <div className={styles.containerQuantity}>
                  <p>Quantity:</p>
                  <input
                    className={sharedStyles.numericalInput}
                    type='number'
                    min={1}
                    max={Math.min(MAX_ALLOWED_QUANTITY, selectedProduct.stock)}
                    step={1}
                    value={quantity}
                    onChange={e => {
                      if (/[^0-9]/.test(e.target.value)) {
                        return;
                      }

                      let quantityToSet = Number(e.target.value);
                      const maxAllowed = Math.min(MAX_ALLOWED_QUANTITY, selectedProduct.stock);
                      if (quantityToSet > maxAllowed) {
                        quantityToSet = maxAllowed;
                      }
                      if (quantityToSet < 1) {
                        quantityToSet = 1;
                      }

                      setQuantity(quantityToSet);
                    }}
                  />
                </div>
                <div>
                  <p className={styles.price}>
                    {selectedProduct.offer
                      ? <span><s>{selectedProduct.price * quantity}$</s> </span>
                      : <></>
                    }
                    {selectedProduct.actualPrice * quantity}$
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className={styles.containerBasketButton}>
                <button className='commission-btn' onClick={addProductToBasket}>
                  Add To Basket
                </button>
              </div>
            </div>
          </div>
          <div className={styles.containerImage}>
            <img
              src={productGroup.imageUrl}
              alt={productGroup.name}
            />
          </div>
        </div>
      </motion.div>
    </ModalBackdrop>
  );
};

export default ProductModal;

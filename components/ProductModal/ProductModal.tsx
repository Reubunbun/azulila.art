import { type FC, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import type { ProductGroup, Product } from 'interfaces';
import { useShopContext } from 'context/ShopContext';
import ModalBackdrop from 'components/ModalBackdrop/ModalBackdrop';
import sharedStyles from 'styles/shop-shared.module.css';
import styles from './ProductModal.module.css';

interface Props {
  productGroup: ProductGroup,
  close: () => void,
}

const MAX_ALLOWED_QUANTITY = Infinity;

const ProductModal: FC<Props> = ({ productGroup, close }) => {
  const [selectedProductId, setSelectedProductId] = useState<number>(
    (
      productGroup.products.filter(p => p.stock > 0)[0] ||
      productGroup.products[0]
    ).productId,
  );
  const [quantity, setQuantity] = useState<number>(1);
  const warningDiv = useRef<HTMLDivElement>(null);

  const selectedProduct: Product = productGroup.products.find(
    product => selectedProductId === product.productId,
  )!;

  const { dispatchProduct } = useShopContext();

  const addProductToBasket = () => {
    if (quantity < 1 || quantity > selectedProduct.stock) {
      if (!warningDiv.current) return;

      warningDiv.current.classList.remove('warning');
      void warningDiv.current.offsetWidth;
      warningDiv.current.classList.add('warning');

      return;
    }

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
            <CloseIcon color='inherit' />
          </button>
        </div>
        <div className={styles.containerDesktopSplit}>
          <div className={styles.containerMainContent}>
            <div>
              <h1>{productGroup.name}</h1>
              <pre className={styles.productDescription}>
                {productGroup.description}
              </pre>
            </div>
            <div>
              {productGroup.products.filter(p => p.stock > 0).length > 1
                ? <>
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
                            {`${product.name} - ${product.price}$`}
                          </option>
                        )}
                      </select>
                    </div>
                    <div className={styles.containerWarnings} ref={warningDiv}>
                      <p style={{ display: quantity === 0 ? undefined : 'none' }}>
                        You must purchase at least one
                      </p>
                      <p style={{ display: quantity > selectedProduct.stock ? undefined : 'none' }}>
                        Sorry, there is only {selectedProduct.stock} left in stock, please select a lower number
                      </p>
                    </div>
                    <div className={styles.containerQuantityAndPrice}>
                      <div className={styles.containerQuantity}>
                        <p>Quantity:</p>
                        <input
                          className={sharedStyles.numericalInput}
                          type='text'
                          max={Math.min(MAX_ALLOWED_QUANTITY, selectedProduct.stock)}
                          value={quantity}
                          onChange={e => {
                            if (/[^0-9]/.test(e.target.value)) {
                              return;
                            }

                            setQuantity(Number(e.target.value));
                          }}
                        />
                      </div>
                      <div>
                        <p className={styles.price}>
                          {selectedProduct.price * quantity}$
                        </p>
                      </div>
                    </div>
                  </>
                : <p>Sorry, this item is no longer in stock</p>
              }
            </div>
            <div>
              {productGroup.products.filter(p => p.stock > 0).length > 1 &&
                <div className={styles.containerBasketButton}>
                  <button className='commission-btn' onClick={addProductToBasket}>
                    Add To Basket
                  </button>
                </div>
              }
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

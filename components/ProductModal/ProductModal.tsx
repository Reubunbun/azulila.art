import { type FC, useState, Fragment } from 'react';
import { motion } from 'framer-motion';
import type { ProductGroup, Product } from 'interfaces';
import ModalBackdrop from 'components/ModalBackdrop/ModalBackdrop';
import styles from './ProductModal.module.css';

interface Props {
  productGroup: ProductGroup,
  close: () => void,
}

const strikethroughText = (input: string) =>
  [...input].map(char => `${char}\u0336`).join('')

const ProductModal: FC<Props> = ({ productGroup, close }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    productGroup.products[0],
  );
  const [quantity, setQuantity] = useState<number>(1);

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
              <div className={styles.containerSelect}>
                <p>Select Option:</p>
                <select>
                  {productGroup.products.map(product =>
                    <option
                      key={product.productId}
                      onClick={() => setSelectedProduct(product)}
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
              <div className={styles.containerQuantity}>
                <p>Quantity:</p>
                <input
                  type='number'
                  min={1}
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                />
              </div>
              <div className={styles.containerPrice}>
                <p className={styles.price}>
                  {selectedProduct.offer
                    ? <span><s>{selectedProduct.price * quantity}$</s> </span>
                    : <></>
                  }
                  {selectedProduct.actualPrice * quantity}$
                </p>
              </div>
            </div>
            <div>
              <div className={styles.containerBasketButton}>
                <button className='commission-btn'>
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

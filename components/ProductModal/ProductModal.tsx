import { type FC, useState, Fragment } from 'react';
import { motion } from 'framer-motion';
import { useUIContext } from 'context/UIContext';
import type { ProductGroup, Product } from 'interfaces';
import ModalBackdrop from 'components/ModalBackdrop/ModalBackdrop';
import styles from './ProductModal.module.css';

interface Props {
  productGroup: ProductGroup,
  close: () => void,
}

const ProductModal: FC<Props> = ({ productGroup, close }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    productGroup.products[0],
  );
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <ModalBackdrop close={close} key='modal'>
      <motion.div
        onClick={close}
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
        <div className={styles.containerMainContent}>
          <h1>{productGroup.name}</h1>
          <p className={styles.productDescription}>
            {productGroup.description}
          </p>
          <p className={styles.price}>
            {selectedProduct.actualPrice * quantity}$
          </p>
          <div className={styles.containerSelect}>
            <select>
              {productGroup.products.map(product =>
                <option key={product.productId}>
                  {product.name} - {
                    product.offer
                      ? <Fragment>
                          <s>{product.price}</s>{product.actualPrice}$
                        </Fragment>
                      : <Fragment>{product.price}$</Fragment>
                  }
                </option>
              )}
            </select>
          </div>
        </div>
      </motion.div>
    </ModalBackdrop>
  );
};

export default ProductModal;

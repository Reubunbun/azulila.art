import type { Page, PurchaseSuccessResponse } from 'interfaces';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useShopContext } from 'context/ShopContext';
import { CODE_TO_COUNTRY } from 'helpers/countries';
import axios from 'axios';
import styles from './order-confirm.module.css';

const Success: Page = () => {
  const [purchaseInfo, setPurchaseInfo] = useState<PurchaseSuccessResponse | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const { dispatchProduct } = useShopContext();

  useEffect(() => {
    if (!id) return;

    axios.get<PurchaseSuccessResponse>(
      `/api/order/${id}`,
    )
      .then(resp => setPurchaseInfo(resp.data));
  }, [id]);

  useEffect(() => {
    dispatchProduct({ type: 'RESET' });
  }, []);

  return (
    <div className={styles.containerConfirmation}>
      <span
        className='link'
        onClick={() => router.push('/secret-shop')}
      >
        Back to products
      </span>
      <h1>Purchase Successful!</h1>
      <p>You will receive an email once I have been notified and have processed your request.</p>
      <div className={styles.containerOrderInfo}>
        {purchaseInfo &&
          <div className={styles.containerOrderBlocks}>
            <div>
              <h3>You ordered:</h3>
              <ul className={styles.productList}>
                {purchaseInfo.productInfo.map(({ quantity, groupName, productName }, i) =>
                  <li key={i}>
                    {groupName === productName ? groupName : `${groupName} - ${productName}`} <span className={styles.quantity}>x{quantity}</span>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h3>It will be delivered to</h3>
              <div className={styles.containerAddress}>
                <p>{purchaseInfo.contactInfo.name}</p>
                <p>{purchaseInfo.contactInfo.line1}</p>
                {purchaseInfo.contactInfo.line2 && <p>{purchaseInfo.contactInfo.line2}</p>}
                <p>{purchaseInfo.contactInfo.city}</p>
                <p>{purchaseInfo.contactInfo.state}</p>
                <p>{purchaseInfo.contactInfo.zip}</p>
                <p>{CODE_TO_COUNTRY[purchaseInfo.contactInfo.country]}</p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

Success.title = 'Payment Success!';
Success.description = 'Payment Success!';

export default Success;

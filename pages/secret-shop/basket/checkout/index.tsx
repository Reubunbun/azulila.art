import { type Page } from 'interfaces';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useShopContext } from 'context/ShopContext';
import { COUNTRIES } from 'helpers/countries';
import sharedStyles from 'styles/shop-shared.module.css';
import styles from './checkout.module.css';

const Checkout: Page = () => {
  const router = useRouter();
  const { basket } = useShopContext();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [line1, setLine1] = useState<string>('');
  const [line2, setLine2] = useState<string>('');
  const [line3, setLine3] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [country, setCountry] = useState<string>('United States');

  const [couponCode, setCouponCode] = useState<string>('');

  const shippingCost = country === 'United States' ? 5 : 15;

  useEffect(() => {
    if (basket.products.length === 0) {
      router.push('/secret-shop');
    }
  }, [basket, router]);

  const checkout = async () => {};

  return (
    <div className={sharedStyles.infoBg}>
      <div className={styles.containerLink}>
        <span
          onClick={() => router.push('/secret-shop/basket')}
          className='link'
        >
          Back to cart
        </span>
      </div>
      <div className={styles.containerAllInputs}>
        <div className={styles.containerContactInfo}>
          <h2>Contact Information</h2>
          <div className={styles.containerTextInput}>
            <p>First Name:</p>
            <input
              className={sharedStyles.textInput}
              type='text'
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder='John'
            />
          </div>
          <div className={styles.containerTextInput}>
            <p>Last Name:</p>
            <input
              className={sharedStyles.textInput}
              type='text'
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder='Doe'
            />
          </div>
          <div className={styles.containerTextInput}>
            <p>Email:</p>
            <input
              className={sharedStyles.textInput}
              type='text'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='john.doe@example.com'
            />
          </div>
        </div>
        <div className={styles.containerAddressInfo}>
          <h2>Shipping</h2>
          <div className={styles.containerTextInput}>
            <p>Line 1:</p>
            <input
              className={sharedStyles.textInput}
              type='text'
              value={line1}
              onChange={e => setLine1(e.target.value)}
              placeholder='Apartment 1'
            />
          </div>
          <div className={styles.containerTextInput}>
            <p>Line 2 (Optional):</p>
            <input
              className={sharedStyles.textInput}
              type='text'
              value={line2}
              onChange={e => setLine2(e.target.value)}
              placeholder='123 Example Street'
            />
          </div>
          <div className={styles.containerTextInput}>
            <p>Line 3 (Optional):</p>
            <input
              className={sharedStyles.textInput}
              type='text'
              value={line3}
              onChange={e => setLine3(e.target.value)}
              placeholder='Example Place'
            />
          </div>
          <div className={styles.containerTextInput}>
            <p>City:</p>
            <input
              className={sharedStyles.textInput}
              type='text'
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder='City'
            />
          </div>
          <div className={styles.containerTextInput}>
            <p>State / Province:</p>
            <input
              className={sharedStyles.textInput}
              type='text'
              value={state}
              onChange={e => setState(e.target.value)}
              placeholder='State'
            />
          </div>
          <div className={styles.containerTextInput}>
            <p>Zip / Postal Code:</p>
            <input
              className={sharedStyles.textInput}
              type='text'
              value={zipCode}
              onChange={e => setZipCode(e.target.value)}
              placeholder='12345'
            />
          </div>
          <div className={styles.containerTextInput}>
            <p>Country:</p>
            <select
              className={sharedStyles.select}
              value={country}
              onChange={e => setCountry(e.target.value)}
            >
              {COUNTRIES.map(countryName =>
                <option key={countryName} value={countryName}>
                  {countryName}
                </option>
              )}
            </select>
          </div>
        </div>
        <div className={styles.containerOffer}>
          <h2>Coupon Code:</h2>
          <input
            className={sharedStyles.textInput}
            type='text'
            value={couponCode}
            onChange={e => setCouponCode(e.target.value)}
          />
        </div>
        <div className={styles.containerSummary}>
          <h2>Summary</h2>
          {basket.products.map(product =>
            <div
              key={product.groupId}
              className={`${styles.summaryProduct} ${styles.summaryItem}`}
            >
              <div>
                <p className={styles.groupName}>{product.groupName}</p>
                <p>{product.productName} x{product.quantity}</p>
              </div>
              <p className={styles.price}>{product.actualTotalPrice}$</p>
            </div>
          )}
          <div className={styles.summaryItem}>
            <div>
              <p className={styles.subTotal}>Subtotal:</p>
              <p>Shipping:</p>
            </div>
            <div>
              <p className={`${styles.subTotal} ${styles.price}`}>
                {basket.actualTotalPrice}$
              </p>
              <p className={styles.price}>{shippingCost}$</p>
            </div>
          </div>
          <div style={{borderBottom: 'none'}} className={styles.summaryItem}>
            <p>Total:</p>
            <p className={styles.price}>{basket.actualTotalPrice + shippingCost}$</p>
          </div>
          <div style={{borderBottom: 'none'}} className={styles.containerFinalButton}>
            <button
              className={sharedStyles.checkoutButton}
              onClick={checkout}
            >
              Finalize Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Checkout.title = 'Checkout';
Checkout.description = 'Checkout';

export default Checkout;

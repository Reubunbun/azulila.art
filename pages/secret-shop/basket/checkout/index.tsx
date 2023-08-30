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

  useEffect(() => {
    if (basket.products.length === 0) {
      router.push('/secret-shop');
    }
  }, [basket, router]);

  return (
    <div>
      <div>
        <span
          onClick={() => router.push('/secret-shop/basket')}
          className='link'
        >
          Back to cart
        </span>
      </div>
      <div className={styles.containerAllInputs}>
        <div className={styles.containerContactInfo}>
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
      </div>
    </div>
  );
};

Checkout.title = 'Checkout';
Checkout.description = 'Checkout';

export default Checkout;

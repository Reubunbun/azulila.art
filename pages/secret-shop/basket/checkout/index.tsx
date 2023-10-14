import { type Page } from 'interfaces';
import { type RefObject, type MouseEventHandler, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { PayPalButtons } from '@paypal/react-paypal-js';
import type { OnApproveData, OnApproveActions } from '@paypal/paypal-js'
import axios from 'axios';
import type { PurchaseRequest, PurchaseResponse } from 'interfaces';
import { useShopContext } from 'context/ShopContext';
import { CODE_TO_COUNTRY } from 'helpers/countries';
import sharedStyles from 'styles/shop-shared.module.css';
import styles from './checkout.module.css';

const createInputWarning = (inputRef: RefObject<HTMLInputElement>, warningText: string) => {
  if (!inputRef.current) return;

  inputRef.current.placeholder = warningText;
  inputRef.current.classList.remove('warning');
  void inputRef.current.offsetWidth;
  inputRef.current.classList.add('warning');
};

type RequestError = {type: 'Generic'} | {type: 'Stock'; message: string};

const Checkout: Page = () => {
  const router = useRouter();
  const { basket } = useShopContext();

  const [firstName, setFirstName] = useState<string>('');
  const firstNameRef = useRef<HTMLInputElement>(null);

  const [lastName, setLastName] = useState<string>('');
  const lastNameRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState<string>('');
  const emailRef = useRef<HTMLInputElement>(null);
  const emailWarningRef = useRef<HTMLParagraphElement>(null);

  const [line1, setLine1] = useState<string>('');
  const line1Ref = useRef<HTMLInputElement>(null);

  const [line2, setLine2] = useState<string>('');
  const line2Ref = useRef<HTMLInputElement>(null);

  const [city, setCity] = useState<string>('');
  const cityRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<string>('');
  const stateRef = useRef<HTMLInputElement>(null);

  const [zipCode, setZipCode] = useState<string>('');
  const zipCodeRef = useRef<HTMLInputElement>(null);

  const [country, setCountry] = useState<string>('US');
  const countryRef = useRef<HTMLSelectElement>(null);

  const [isValid, setIsValid] = useState<boolean>(false);

  const [error, setError] = useState<RequestError | null>(null);

  const shippingCost = country === 'US' ? 5 : 15;

  useEffect(() => {
    if (basket.products.length === 0) {
      router.push('/secret-shop');
    }
  }, [basket, router]);

  useEffect(() => {
    setIsValid(Boolean(
      firstName &&
      lastName &&
      email &&
      /^[\w\.-]+@[\w\.-]+\.\w+$/.test(email) &&
      line1 &&
      city &&
      zipCode &&
      state
    ));
  }, [firstName, lastName, email, line1, city, zipCode, state]);

  const checkout: MouseEventHandler<HTMLDivElement> = async e => {
    if (
      !firstNameRef.current ||
      !lastNameRef.current ||
      !emailRef.current ||
      !emailWarningRef.current ||
      !line1Ref.current ||
      !cityRef.current ||
      !stateRef.current ||
      !zipCodeRef.current
    ) return;

    emailWarningRef.current.style.display = 'none';

    let scrollToRef: RefObject<HTMLInputElement> | undefined;

    if (!firstName) {
      scrollToRef = firstNameRef;

      createInputWarning(firstNameRef, 'Missing first name');
    }

    if (!lastName) {
      if (!scrollToRef) scrollToRef = lastNameRef;

      createInputWarning(lastNameRef, 'Missing last name');
    }

    if (!email) {
      if (!scrollToRef) scrollToRef = emailRef;

      createInputWarning(emailRef, 'Missing email');
    }

    const emailIsValid = /^[\w\.-]+@[\w\.-]+\.\w+$/.test(email);
    if (email && !emailIsValid) {
      if (!scrollToRef) scrollToRef = emailRef;

      emailWarningRef.current.style.display = 'block';

      createInputWarning(emailRef, 'Invalid email');
    }

    if (!line1) {
      if (!scrollToRef) scrollToRef = line1Ref;

      createInputWarning(line1Ref, 'Missing line 1');
    }

    if (!city) {
      if (!scrollToRef) scrollToRef = cityRef;

      createInputWarning(cityRef, 'Missing city');
    }

    if (!zipCode) {
      if (!scrollToRef) scrollToRef = zipCodeRef;

      createInputWarning(zipCodeRef, 'Missing zip or postal code');
    }

    if (!state) {
      if (!scrollToRef) scrollToRef = stateRef;

      createInputWarning(stateRef, 'Missing state or province');
    }

    if (
      !firstName ||
      !lastName ||
      !email ||
      !emailIsValid ||
      !line1 ||
      !city ||
      !state ||
      !zipCode
    ) {
      if (scrollToRef && scrollToRef.current) {
        window.scrollTo({
          top: scrollToRef.current?.getBoundingClientRect().top + window.scrollY - 150,
          behavior: 'smooth',
        });
      }

      return;
    };
  };

  const createOrder = async () => {
    try {
      const resp = await axios.post<PurchaseResponse>('/api/order', {
        firstName: firstNameRef.current?.value,
        lastName: lastNameRef.current?.value,
        email: emailRef.current?.value,
        line1: line1Ref.current?.value,
        line2: line2Ref.current?.value || null,
        city: cityRef.current?.value,
        state: stateRef.current?.value,
        zipCode: zipCodeRef.current?.value,
        country: countryRef.current?.value,
        products: basket.products.map(product => ({
          productId: product.productId,
          quantity: product.quantity,
        })),
      } as PurchaseRequest);

      return resp.data.id;
    } catch (err) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      console.dir(err);

      if ((err as any)?.response?.status === 410) {
        setError({ type: 'Stock', message: (err as any)?.response?.data?.message });
      } else {
        setError({ type: 'Generic' });
      }
      throw err;
    }
  };

  const captureOrder = async (data: OnApproveData, actions: OnApproveActions) => {
    try {
      await axios.put('/api/order', { paypalReference: data.orderID });
    } catch (err) {
      setError({ type: 'Generic' });
    }
    router.push(`/secret-shop/order-confirm/${data.orderID}`);
  };

  return (
    <>
      {error &&
        <div className={styles.errorWrapper}>
          {error.type === 'Generic'
            ? <p>There was an error processing your order.</p>
            : error.message.split('\n').map(line => <p key={line}>{line}</p>)
          }
        </div>
      }
      <div className={`${styles.formWrapper} ${sharedStyles.infoBg}`}>
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
                ref={firstNameRef}
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
                ref={lastNameRef}
                className={sharedStyles.textInput}
                type='text'
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder='Doe'
              />
            </div>
            <div className={styles.containerTextInput}>
              <p>Email:</p>
              <p
                style={{ color: 'var(--font-warning)', display: 'none' }}
                ref={emailWarningRef}
              >
                This email does not look valid
              </p>
              <input
                ref={emailRef}
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
                ref={line1Ref}
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
                ref={line2Ref}
                className={sharedStyles.textInput}
                type='text'
                value={line2}
                onChange={e => setLine2(e.target.value)}
                placeholder='123 Example Street'
              />
            </div>
            <div className={styles.containerSmallInputs}>
              <div>
                <div className={styles.containerTextInput}>
                  <p>City:</p>
                  <input
                    ref={cityRef}
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
                    ref={stateRef}
                    className={sharedStyles.textInput}
                    type='text'
                    value={state}
                    onChange={e => setState(e.target.value)}
                    placeholder='State'
                  />
                </div>
              </div>
              <div>
                <div className={styles.containerTextInput}>
                  <p>Zip / Postal Code:</p>
                  <input
                    ref={zipCodeRef}
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
                    className={`${sharedStyles.select} ${sharedStyles.dark}`}
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    ref={countryRef}
                  >
                    {Object.entries(CODE_TO_COUNTRY).map(([code, countryName]) =>
                      <option key={code} value={code}>
                        {countryName}
                      </option>
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.containerSummary}>
            <h2>Summary</h2>
            {basket.products.map(product =>
              <div
                key={product.productId}
                className={`${styles.summaryProduct} ${styles.summaryItem}`}
              >
                <div>
                  <p className={styles.groupName}>{product.groupName}</p>
                  <p>{product.productName} x{product.quantity}</p>
                </div>
                <p className={styles.price}>{product.totalPrice}$</p>
              </div>
            )}
            <div
              style={{marginTop: '1rem'}}
              className={`${styles.summaryItem} ${styles.containerTotals}`}
            >
              <div>
                <p>Subtotal:</p>
                <p>Shipping:</p>
                <p>Total:</p>
              </div>
              <div>
                <p className={`${styles.subTotal} ${styles.price}`}>
                  {basket.totalPrice}$
                </p>
                <p className={styles.price}>{shippingCost}$</p>
                <p className={styles.price}>{basket.totalPrice + shippingCost}$</p>
              </div>
            </div>
            <div
              className={styles.containerPaypal}
              onClick={checkout}
              style={{ cursor: isValid ? undefined : 'pointer' }}
            >
              <div style={{ pointerEvents: isValid ? undefined : 'none' }} >
                <PayPalButtons
                  createOrder={createOrder}
                  onApprove={captureOrder}
                  onError={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Checkout.title = 'Checkout';
Checkout.description = 'Checkout';

export default Checkout;

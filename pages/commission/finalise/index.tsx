import type { Page } from '../../../interfaces';
import { useRouter } from 'next/router';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCommissionContext } from '../../../context/CommissionContext';
import RadioButtons from '../../../components/RadioButtons/RadioButtons';
import CustomAnimatePresence from '../../../components/CustomAnimatePresence/CustomAnimatePresence';
import scrollToTop from '../../../helpers/smoothScroll';
import styles from './Finalise.module.css';

interface PermissionOption {
  display: string;
  value: string;
}

const optionYes: PermissionOption = {
  display: 'Yes',
  value: 'Yes & dont link to their account',
};
const optionYesButLink: PermissionOption = {
  display: 'Yes, but link my social media',
  value: 'Yes & link to their account',
};
const optionNo: PermissionOption = {
  display: 'No',
  value: 'No',
};

const permissionOptions: PermissionOption[] = [
  optionYes,
  optionYesButLink,
  optionNo,
];

const CommissionFinalise: Page = () => {
  const {
    spacesOpen,
    totalPrice,
    userName,
    userContactEmail,
    userPaypalEmail,
    dispatchUserState,
  } = useCommissionContext();

  const router = useRouter();
  useEffect(() => {
    if (spacesOpen === null) {
      router.push('/commission');
    }

    dispatchUserState({type: 'PAGE', payload: router.pathname});
  }, []);

  const nameInput = useRef<HTMLInputElement>(null);
  const contactEmailInput = useRef<HTMLInputElement>(null);
  const paypalEmailInput = useRef<HTMLInputElement>(null);

  const [selectedOption, setSelectedOption] = useState<string>(optionNo.value);
  const [showSocialInput, setShowSocialInput] = useState<boolean>(false);
  const [userSocials, setUserSocials] = useState<string>('');

  useEffect(() => {
    if (selectedOption === optionYesButLink.value) {
      setShowSocialInput(true);
      return;
    }
    setShowSocialInput(false);
  }, [selectedOption]);

  return (
    <>
      <div className={styles.containerHeader}>
        <h2>Your Details</h2>
        <p>Commission Total - ${totalPrice}</p>
      </div>
      <div className={styles.containerFinaliseCommission}>
        <div className={styles.containerAllInputs}>
          <div className={styles.inputBlock}>
            <label htmlFor='name'>Your Name:</label>
            <input
              type='text'
              ref={nameInput}
              name='name'
              value={userName}
              onChange={e => dispatchUserState({
                type: 'USER-NAME',
                payload: e.target.value,
              })}
            />
          </div>
          <div className={styles.inputBlock}>
            <label htmlFor='contact-email'>Your Contact Email:</label>
            <input
              type='text'
              ref={contactEmailInput}
              name='contact-email'
              value={userContactEmail}
              onChange={e => dispatchUserState({
                type: 'USER-CONTACT-EMAIL',
                payload: e.target.value,
              })}
            />
          </div>
          <div className={styles.inputBlock}>
            <label htmlFor='paypal-email'>Your Paypal Email:</label>
            <input
              type='text'
              ref={paypalEmailInput}
              name='paypal-email'
              value={userPaypalEmail}
              onChange={e => dispatchUserState({
                type: 'USER-PAYPAL-EMAIL',
                payload: e.target.value,
              })}
            />
          </div>
          <div className={styles.containerPermissions}>
            <div className={styles.containerPermissionOptions}>
              <p>Can I post the finished work on my social media accounts?</p>
              <div className={styles.containerPermissionButtons}>
                <RadioButtons
                  small={true}
                  groupName='permissions'
                  options={permissionOptions}
                  selected={selectedOption}
                  onValueSelected={selected => setSelectedOption(selected)}
                />
              </div>
            </div>
            <CustomAnimatePresence exitBeforeEnter>
              {showSocialInput &&
                <motion.div
                  className={styles.inputBlock}
                  key={'social-input-container'}
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  exit={{opacity: 0}}
                >
                  <label htmlFor='socials'>
                    Enter social media handles I should link on separate lines:
                  </label>
                  <textarea
                    name='socials'
                    value={userSocials}
                    onChange={e => setUserSocials(e.target.value)}
                  >

                  </textarea>
                </motion.div>
              }
            </CustomAnimatePresence>
          </div>
          <div className='commissionsContainerButton'>
            <button
              onClick={() => {
                scrollToTop().then(() => router.push('/commission/describeCharacters'))
              }}
              className='commission-btn'
            >
              Back
            </button>
            <button
              className='commission-btn'
            >
              Submit
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

CommissionFinalise.title = 'Finalise Commission Details';
CommissionFinalise.dontStick = true;

export default CommissionFinalise;

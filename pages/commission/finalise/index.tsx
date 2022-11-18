import type { Page, CommissionPost } from 'interfaces';
import { useRouter } from 'next/router';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useCommissionContext } from 'context/CommissionContext';
import RadioButtons from 'components/RadioButtons/RadioButtons';
import CustomAnimatePresence from 'components/CustomAnimatePresence/CustomAnimatePresence';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import scrollToTop from 'helpers/smoothScroll';
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

const uploadFileToS3 = (file: File): Promise<string> => {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      axios({
        url: `${process.env.NEXT_PUBLIC_UPLOAD_URL}?Type=${file.type}`,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: reader.result,
      })
        .then(({data}) => {
          res(data.FileName);
        })
        .catch(rej)
    });
    reader.readAsDataURL(file);
})
};

const CommissionFinalise: Page = () => {
  const {
    spacesOpen,
    baseType,
    backgroundType,
    backgroundDescription,
    characters,
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
  const userSocialsInput = useRef<HTMLTextAreaElement>(null);

  const [selectedOption, setSelectedOption] = useState<string>(optionNo.value);
  const [showSocialInput, setShowSocialInput] = useState<boolean>(false);
  const [userSocials, setUserSocials] = useState<string>('');

  const [loadingText, setLoadingText] = useState<string>('');
  const [requestSuccessful, setRequestSuccessful] = useState<boolean>(false);
  const [requestError, setRequestError] = useState<string>('');

  useEffect(() => {
    if (selectedOption === optionYesButLink.value) {
      setShowSocialInput(true);
      return;
    }
    setShowSocialInput(false);
  }, [selectedOption]);

  const submitCommission = () => {
    if (!nameInput.current || !contactEmailInput.current || !paypalEmailInput.current) {
      return;
    }

    if (showSocialInput && !userSocialsInput.current) {
      return;
    }

    nameInput.current.classList.remove('warning');
    void nameInput.current.offsetWidth;

    contactEmailInput.current.classList.remove('warning');
    void contactEmailInput.current.offsetWidth;

    paypalEmailInput.current.classList.remove('warning');
    void paypalEmailInput.current.offsetWidth;

    let errorFound = false;
    if (!userName) {
      errorFound = true;

      nameInput.current.placeholder = 'You must enter something here!';
      nameInput.current.classList.add('warning');
    }

    if (!userContactEmail) {
      errorFound = true;

      contactEmailInput.current.placeholder = 'You must enter something here!';
      contactEmailInput.current.classList.add('warning');
    }

    if (!userPaypalEmail) {
      errorFound = true;

      paypalEmailInput.current.placeholder = 'You must enter something here!';
      paypalEmailInput.current.classList.add('warning');
    }

    if (showSocialInput) {
      if (!userSocialsInput.current) {
        return;
      }

      userSocialsInput.current.classList.remove('warning');
      void userSocialsInput.current.offsetWidth;

      if (!userSocials) {
        errorFound = true;

        userSocialsInput.current.placeholder = 'You must enter something here!';
        userSocialsInput.current.classList.add('warning');
      }
    }

    if (errorFound) {
      return;
    }

    if (!baseType || !backgroundType) {
      return;
    }

    (async () => {
      const characterImages: {[id: number]: string[]} = {};

      let imagesToUpload = characters.reduce(
        (prev, curr) => prev + Object.keys(curr.fileMap).length,
        0,
      );
      let imagesUploaded = 0;
      let imagesFailed = 0;

      setRequestError('');
      setLoadingText(
        `Uploading characters images, this may take a while (0/${imagesToUpload})`,
      );

      await Promise.all(
        characters.map(
          character => Promise.all(
            Object.values(character.fileMap).map(
              file => uploadFileToS3(file).then(fileName => {
                setLoadingText(
                  `Uploading characters images, this may take a while (${++imagesUploaded + imagesFailed}/${imagesToUpload})`,
                );
                return fileName;
              })
                .catch(() => {
                  setLoadingText(
                    `Uploading characters images, this may take a while (${imagesUploaded + ++imagesFailed}/${imagesToUpload})`,
                  );
                  return 'Failed';
                }),
            ),
          )
            .then(fileNames => characterImages[character.id] = fileNames)
            .catch(console.dir)
        ),
      );

      setLoadingText('Submitting commission request...');

      const postPermissionGiven = (
        selectedOption === optionYes.value ||
        selectedOption === optionYesButLink.value
      );

      const postData: CommissionPost = {
        totalPrice,
        baseType: {
          display: baseType.display,
          price: baseType.price,
          offer: baseType.offer,
          actualPrice: baseType.actualPrice,
        },
        backgroundType: {
          display: backgroundType.display,
          price: backgroundType.price,
          offer: backgroundType.offer,
          actualPrice: backgroundType.actualPrice,
        },
        backgroundDescription,
        userName,
        userContactEmail,
        userPaypalEmail,
        userSocials: selectedOption === optionYesButLink.value
          ? userSocials.split('\n')
          : [],
        postPermissionGiven,
        characters: characters.map(character => ({
          visualDescription: character.visualDescription,
          personalityDescription: character.personalityDescription,
          imageURLs: characterImages[character.id],
        })),
        failedImages: imagesFailed > 0,
      };

      axios({
        url: '/api/commission',
        method: 'POST',
        data: postData,
      })
        .then(() => {
          setLoadingText('');
          setRequestSuccessful(true);
          dispatchUserState({type: 'RESET'});
          dispatchUserState({type: 'PAGE', payload: ''});
        })
        .catch(() => {
          setLoadingText('');
          setRequestError('Something went wrong sending the commission request, I\'m very sorry for the inconvenience. Please feel free to email me directly with your request at azulilah.art@gmail.com');
          dispatchUserState({type: 'RESET'});
          dispatchUserState({type: 'PAGE', payload: ''});
        });
    })();
  };

  if (requestSuccessful) {
    return <p className={styles.successText}>Your commission request has been sent! Please keep an eye out in your emails, I will confirm I have received your request as soon as possible.</p>;
  }

  if (requestError) {
    return <p className={styles.errorText}>{requestError}</p>
  }

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
                    ref={userSocialsInput}
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
            {loadingText &&
              <LoadingSpinner
                loadingText={loadingText}
                width='9rem'
              />
            }
            {!loadingText &&
              <>
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
                  onClick={submitCommission}
                >
                  Submit
                </button>
              </>
            }
          </div>
        </div>
      </div>
    </>
  );
};

CommissionFinalise.title = 'Finalise Commission Details';
CommissionFinalise.dontStick = true;
CommissionFinalise.description = 'Request a commission here and I\'ll get back to you as soon as possible!';

export default CommissionFinalise;

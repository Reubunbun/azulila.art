import { useState, useRef } from 'react';
import type { Page } from '../../interfaces/index';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import styles from './Contact.module.css';

const Contact: Page = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [reCaptchaToken, setReCaptchaToken] = useState<string>('');

  const [isSending, setIsSending] = useState<boolean>(false);
  const [requestError, setRequestError] = useState<string>('');
  const [requestSuccess, setRequestSuccess] = useState<boolean>(false);

  const nameInput = useRef<HTMLInputElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const contentInput = useRef<HTMLTextAreaElement>(null);
  const reCaptchaInput = useRef<ReCAPTCHA>(null);

  const handleSubmit = () => {
    if (!nameInput.current || !emailInput.current || !contentInput.current) return;

    if (!name) {
      nameInput.current.placeholder = 'Please fill in your name';
      nameInput.current.classList.remove('warning');
      void nameInput.current.offsetWidth;
      nameInput.current.classList.add('warning');
    }

    if (!email) {
      emailInput.current.placeholder = 'Please fill in your email';
      emailInput.current.classList.remove('warning');
      void emailInput.current.offsetWidth;
      emailInput.current.classList.add('warning');
    }

    if (!content) {
      contentInput.current.placeholder = 'Please fill in a message';
      contentInput.current.classList.remove('warning');
      void contentInput.current.offsetWidth;
      contentInput.current.classList.add('warning');
    }

    if (!name || !email || !content) return;

    if (!reCaptchaToken) {
      return setRequestError('Please click the ReCaptcha checkbox');
    }

    setIsSending(true);
    setRequestError('');
    setRequestSuccess(false);

    axios({
      url: '/api/email',
      method: 'POST',
      data: {
        FromName: name,
        FromEmail: email,
        MessageBody: content,
        ReCaptchaToken: reCaptchaToken,
      },
    })
      .then(() => {
        setIsSending(false);
        setRequestSuccess(true);
        setReCaptchaToken('');
        reCaptchaInput.current?.reset();
      })
      .catch(e => {
        setIsSending(false);
        setReCaptchaToken('');
        reCaptchaInput.current?.reset();
        if (e?.response?.status === 429) {
          return setRequestError('Please wait before sending another email');
        }
        if (e?.response?.status === 401) {
          return setRequestError('Recaptcha has been unable to verify that you\'re human. Please email me directly at azulilah.art@gmail.com')
        }
        return setRequestError(
          'Something went wrong, please try again or if the error persists ' +
          'feel free to email me directly at azulilah.art@gmail.com'
        );
      });
  };

  return (
    <>
      <h2>Contact Me</h2>
      <div className={styles.containerForm}>
        <form>
          <div className={styles.inputBlock}>
            <label htmlFor='name-input'>Your Name:</label>
            <input
              ref={nameInput}
              name='name-input'
              value={name}
              onChange={e => setName(e.target.value)}
              type='text'
            />
          </div>
          <div className={styles.inputBlock}>
            <label htmlFor='email-input'>Your Email:</label>
            <input
              ref={emailInput}
              name='email-input'
              className='hasPlaceholder'
              value={email}
              onChange={e => setEmail(e.target.value)}
              type='text'
              placeholder={'Please type carefully or I can\'t reach you!'}
            />
          </div>
          <div className={styles.areaBlock}>
            <label htmlFor='message-input'>Message Content:</label>
            <textarea
              ref={contentInput}
              name='message-input'
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>
          <div className={styles.containerBtn}>
            {isSending
              ? <LoadingSpinner
                  loadingText='Sending email...'
                  width={`7.5rem`}
                />
              : <div className={styles.containerCaptchaSubmit}>
                  <button
                    type='button'
                    className='submitBtn'
                    onClick={handleSubmit}
                    style={{
                      display: reCaptchaToken ? 'block' : 'none'
                    }}
                  >
                    Submit
                  </button>
                  <div
                    className={styles.containerRecaptcha}
                    style={{
                      display: reCaptchaToken ? 'none' : 'block'
                    }}
                  >
                    <ReCAPTCHA
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY || ''}
                      ref={reCaptchaInput}
                      onChange={token => setReCaptchaToken(token || '')}
                    />
                  </div>
                </div>
            }
            {requestError &&
              <p className={styles.textError}>
                <b>{requestError}</b>
              </p>
            }
            {requestSuccess &&
              <p className={styles.textSuccess}>
                <b>Email sent! I will respond as soon as possible</b>
              </p>
            }
          </div>
        </form>
      </div>
    </>
  );
};
Contact.title = 'Contact Me';
Contact.dontStick = true;

export default Contact;

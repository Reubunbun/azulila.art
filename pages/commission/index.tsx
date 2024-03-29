import type { Page } from 'interfaces';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCommissionContext } from 'context/CommissionContext';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import scrollToTop from 'helpers/smoothScroll';
import styles from './Commission.module.css';

const TO_LIST: string[] = [
  'Payment is up-front and in full. I do not accept partial payments.',
  'All commission types are Full Body.',
  'A maximum of three characters per artwork + full price for each character.',
  'Revisions are allowed in Sketch phase.',
  'Finished pictures do not include revisions.',
  'Works/Commissions can be completed within 1 week to 6 months (give or take) to complete; so I ask for patience.',
  'You may request a refund if the 6 month time period has passed.',
  'You may use your commission for personal use ONLY (including reposting to your personal account), but may not use it for resale/NFT\'s/merchandising.',
  'Will draw: OCs, Fancharacters, official characters, humanoids, furries, Sonic characters, Splatoon characters, female nudity.',
  'Won\'t draw: Mechas, explicit NSFW, male nudity (only shirtless).',
];

const Commission: Page = () => {
  const [networkError, setNetworkError] = useState<boolean>(false);
  const router = useRouter();
  const {
    spacesOpen,
    fetchCommissionData,
    dispatchUserState,
  } = useCommissionContext();

  useEffect(() => {
    fetchCommissionData().catch(() => setNetworkError(true));
    dispatchUserState({type: 'PAGE', payload: router.pathname});
  }, []);


  return (
    <>
      <h2 className={styles.mainHeader}>Commission Me</h2>
      {(spacesOpen || 0) > 0 &&
        <p className={`highlight-text ${styles.spacesText}`}>
          {spacesOpen} Spaces Open!
        </p>
      }
      <div
        style={{
          minHeight: (spacesOpen || 0) === 0
            ? 'unset'
            : undefined,
        }}
        className={styles.containerTerms}
      >
        {!networkError && spacesOpen === null &&
          <div style={{marginBottom: '1rem'}}>
            <LoadingSpinner
              loadingText='Checking Availability...'
              width='9rem'
            />
          </div>
        }
        {networkError &&
          <p style={{
            width: '100%',
            marginTop: 0,
            textAlign: 'center'
          }}>
            There was a network error, please try refreshing the page. <br/>
            If this problem persists, please feel free to email me your request at azulilah.art@gmail.com
          </p>
        }
        {spacesOpen === 0 &&
          <p style={{
            width: '100%',
            marginTop: 0,
            textAlign: 'center'
          }}>
            So sorry, but my commission requests are full right now. Please check back again soon!
          </p>
        }
        {(spacesOpen || 0) > 0 &&
          <>
            <p>Thank you for your interest in commissioning me! Before continuing, please read my terms and conditions:</p>
            <div className={styles.containerList}>
              <ul>
                {TO_LIST.map(item =>
                  <li key={item} className={styles.listItem}>
                    <embed src='/icons/list-icon.svg' /> <p>{item}</p>
                  </li>
                )}
              </ul>
            </div>
            <p style={{marginTop: '2rem'}}>If you have further questions, feel free to <Link href='/contact'><a className='highlight-text'>send me an e-mail</a></Link> and I will respond as soon as I&apos;m available.</p>
            <p>Once form is sent, I will contact you personally to ask for details and send you an invoice via Paypal <small>(@taniareyesramirez@gmail.com)</small>.</p>
            <div className='commissionsContainerButton'>
              <button
                onClick={() => {
                  scrollToTop().then(() => router.push('/commission/selectType'));
                }}
                className='commission-btn'
              >
                Next
              </button>
            </div>
          </>
        }
      </div>
    </>
  );
};

Commission.title = 'Commission Me';
Commission.description = 'Request a commission here and I\'ll get back to you as soon as possible!';

export default Commission;

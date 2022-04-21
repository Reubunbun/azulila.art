import type { Page } from '../../interfaces/index';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';
import { useAppContext } from '../../context/AppContext';
import scrollToTop from '../../helpers/smoothScroll';
import styles from './Commission.module.css';

const c_ToSList: string[] = [
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
  const router = useRouter();
  const { fetchCommissionData } = useAppContext('commissionData');

  useEffect(() => {
    fetchCommissionData();
  }, []);

  return (
    <>
      <h2>Commission Me</h2>
      <div className={styles.containerTerms}>
        <p>Thank you for your interest in commissioning me! Before continuing, please read my terms and conditions:</p>
        <div className={styles.containerList}>
          <ul>
            {c_ToSList.map(item =>
              <li key={item} className={styles.listItem}>
                <embed src='/list-icon.svg' /> <p>{item}</p>
              </li>
            )}
          </ul>
        </div>
        <p>If you have further questions, feel free to <Link href='/contact'><a className='highlight-text'>send me an e-mail</a></Link> and I will respond as soon as I&apos;m available.</p>
        <p>Once form is sent, I will contact you personally to ask for details and send you an invoice via Paypal <small>(@taniareyesramirez@gmail.com)</small>.</p>
        <div className={styles.containerButton}>
          <button
            onClick={() => {
              scrollToTop().then(() => router.push('/commission/selectType'));
            }}
            className='commission-btn'
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

Commission.title = 'Commission Me';

export default Commission;

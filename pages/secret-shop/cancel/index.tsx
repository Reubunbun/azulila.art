import type { Page } from 'interfaces';
import { useEffect } from 'react';
import axios from 'axios';

const Cancel: Page = () => {
  useEffect(() => {
    const stripeReference = (new URL(document.location.href)).searchParams.get('id');
    axios.put('/api/shop', { stripeReference: stripeReference, status: 'CANCEL' });
  }, []);

  return (
    <div>
      <p>We could not complete your payment</p>
    </div>
  );
};

Cancel.title = 'Could Not Complete Payment';
Cancel.description = 'Could Not Complete Payment';

export default Cancel;

import type { Page, PurchaseSuccessResponse } from 'interfaces';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Success: Page = () => {
  const [purchaseInfo, setPurchaseInfo] = useState<PurchaseSuccessResponse | null>(null);

  useEffect(() => {
    const stripeReference = (new URL(document.location.href)).searchParams.get('id');
    axios.put<PurchaseSuccessResponse>(
      '/api/shop',
      { stripeReference: stripeReference, status: 'SUCCESS' },
    )
      .then(resp => setPurchaseInfo(resp.data));
  }, []);

  return (
    <div>
      <h1>Purchase Successful!</h1>
      <pre>{purchaseInfo && JSON.stringify(purchaseInfo, null, 2)}</pre>
    </div>
  );
};

Success.title = 'Payment Success!';
Success.description = 'Payment Success!';

export default Success;

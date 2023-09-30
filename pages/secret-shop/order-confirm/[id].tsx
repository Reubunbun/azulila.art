import type { Page, PurchaseSuccessResponse } from 'interfaces';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Success: Page = () => {
  const [purchaseInfo, setPurchaseInfo] = useState<PurchaseSuccessResponse | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { id } = router.query;
    axios.get<PurchaseSuccessResponse>(
      `/api/order/${id}`,
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

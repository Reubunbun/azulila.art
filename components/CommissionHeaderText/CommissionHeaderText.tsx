import type { FC } from 'react';

interface Props {
  title: string;
  priceTotal: number;
};

const CommissionHeaderText: FC<Props> = ({title, priceTotal}) => {
  return (
    <div style={{width: '100%', marginBottom: '.8rem'}}>
      <h2>{title}</h2>
      {priceTotal > 0 &&
        <p
          style={{
            width: '100%',
            textAlign: 'center',
            margin: 0,
            fontSize: 'clamp(1.1rem, 0.9367rem + 0.8163vw, 1.6rem)',
          }}
        >
          Current Total - ${priceTotal}
        </p>
      }
    </div>
  );
};

export default CommissionHeaderText;

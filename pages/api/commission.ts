import type { NextApiRequest, NextApiResponse } from 'next';
import type { CommissionData, GenericError } from '../../interfaces';
import sql from 'mysql';
import DaoCommissionSpaces from '../../dao/commissions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommissionData | GenericError>,
) {
  if (req.method !== 'GET') {
    return res.status(410).json({message: 'Inavlid Method'});
  }

  const connSQL = sql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
  });

  try {
    const daoCommissionSpaces = new DaoCommissionSpaces(connSQL);
    const numSpaces = await daoCommissionSpaces.getNumSpaces();
    return res.status(200).json({spaces: numSpaces});
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: 'Unknown Server Error'});
  } finally {
    connSQL.destroy();
  }
};

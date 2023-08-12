import type { NextApiRequest, NextApiResponse } from 'next';
import type { GenericError, ProductsResult } from 'interfaces';
import { Client as PGClient } from 'pg';
import DaoProducts from 'dao/Products';

async function get(
    req: NextApiRequest,
    res: NextApiResponse<ProductsResult>,
    pgClient: PGClient,
) {
    const daoProducts = new DaoProducts(pgClient);
    const result = await daoProducts.getAll();
    return res.status(200).json(result);
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<void | ProductsResult | GenericError>,
) {
    if (req.method === 'GET') {
        const pgClient = new PGClient({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
            ssl: { rejectUnauthorized: false },
        });
        try {
            await pgClient.connect();
            const daoProducts = new DaoProducts(pgClient);
            const result = await daoProducts.getAll();
        } catch (err) {
            console.log(err);
            return res.status(500).json({message: 'Unknown Server Error'});
        } finally {
            await pgClient.end();
        }
        return;
    }

    return res.status(410).json({message: 'Inavlid Method'});
}

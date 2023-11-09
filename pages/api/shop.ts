import type { NextApiRequest, NextApiResponse } from 'next';
import type {
    GenericError,
    ProductsResult,
    PurchaseResponse,
    PurchaseSuccessResponse,
} from 'interfaces';
import { Client as PGClient } from 'pg';
import DaoProducts from 'dao/Products';

async function get(
    req: NextApiRequest,
    res: NextApiResponse<ProductsResult>,
    pgClient: PGClient,
) {
    const daoProducts = new DaoProducts(pgClient);
    const productGroups = await daoProducts.getAll();
    for (const productGroup of productGroups) {
        for (const product of productGroup.products) {
            product.price = Number((product.price / 100).toFixed(2));
        }
        productGroup.shippingInt = Number((productGroup.shippingInt / 100).toFixed(2));
        productGroup.shippingUS = Number((productGroup.shippingUS / 100).toFixed(2));
        productGroup.products.sort((a, b) => b.priority - a.priority);
    }
    return res.status(200).json({
        products: productGroups.sort((a, b) => b.priority - a.priority),
        categories: Array.from(
            new Set(productGroups.map(({ mainCategory }) => mainCategory)),
        ),
    });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GenericError | ProductsResult | PurchaseResponse | PurchaseSuccessResponse>,
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
            return await get(req, res, pgClient);
        } catch (err) {
            console.log(err);
            return res.status(500).json({message: 'Unknown Server Error'});
        } finally {
            await pgClient.end();
        }
    }

    return res.status(410).json({ message: 'Inavlid Method' });
}

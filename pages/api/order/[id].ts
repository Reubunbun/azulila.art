import type { NextApiRequest, NextApiResponse } from 'next';
import type {
    GenericError,
    ProductsResult,
    PurchaseResponse,
    PurchaseSuccessResponse,
} from 'interfaces';
import { Client as PGClient } from 'pg';
import DaoProducts from 'dao/Products';
import DaoPurchases from 'dao/Purchases';

async function get(
    req: NextApiRequest,
    res: NextApiResponse<GenericError | PurchaseSuccessResponse>,
    pgClient: PGClient,
) {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
        return res.status(400).json({ message: 'Missing order id' });
    }

    const daoPurchases = new DaoPurchases(pgClient);

    console.log('getting info by id', id);
    const purchaseInfo = await daoPurchases.getPurchaseInfoByPaypalReference(id)
        .catch(console.error);
    if (!purchaseInfo) {
        return res.status(500).json({ message: 'Could not get purchase info' });
    }

    const daoProducts = new DaoProducts(pgClient);
    const productsWithInfo = await daoProducts.getMultipleByIds(
        purchaseInfo.productInfo.map(({ productId }) => productId),
    );

    console.log({ productsWithInfo });

    return res.status(200).json({
        contactInfo: purchaseInfo.contactInfo,
        productInfo: purchaseInfo.productInfo.map(({ quantity, productId }) => {
            const product = productsWithInfo
                .find(nextProduct => nextProduct.product_id === productId)!;
            return {
                quantity,
                groupName: product.group_name,
                productName: product.product_name,
            };
        }),
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

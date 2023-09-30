import type { NextApiRequest, NextApiResponse } from 'next';
import type {
    GenericError,
    ProductsResult,
    PurchaseRequest,
    PurchaseResponse,
    PurchaseSuccessResponse,
} from 'interfaces';
import { Client as PGClient } from 'pg';
import paypal from '@paypal/checkout-server-sdk';
import DaoProducts from 'dao/Products';
import DaoPurchases from 'dao/Purchases';

const Environment = process.env.NODE_ENV === 'development'
    ? paypal.core.SandboxEnvironment
    : paypal.core.SandboxEnvironment;

const paypalClient = new paypal.core.PayPalHttpClient(
    new Environment(
        process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        process.env.PAYPAL_SECRET!
    ),
);
const CURRENCY_CODE = 'USD';
const toPPAmount = (amount: number) => (amount / 100).toFixed(2);

async function get(
    req: NextApiRequest,
    res: NextApiResponse<GenericError | PurchaseSuccessResponse>,
    pgClient: PGClient,
) {
    const { query: { id } } = req;

    if (!id || Array.isArray(id)) {
        return res.status(400).json({ message: 'Missing order id' });
    }

    const daoPurchases = new DaoPurchases(pgClient);

    const purchaseInfo = await daoPurchases.getPurchaseInfoByPaypalReference(id)
        .catch(console.error);
    if (!purchaseInfo) {
        return res.status(500).json({ message: 'Could not get purchase info' });
    }

    const daoProducts = new DaoProducts(pgClient);
    const productsWithInfo = await daoProducts.getMultipleByIds(
        purchaseInfo.productInfo.map(({ productId }) => productId),
    );

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

async function post(
    req: NextApiRequest,
    res: NextApiResponse<GenericError | PurchaseResponse>,
    pgClient: PGClient,
) {
    const {
        firstName,
        lastName,
        email,
        line1,
        line2,
        city,
        zipCode,
        state,
        country,
        products,
    } = req.body as PurchaseRequest;

    const daoProducts = new DaoProducts(pgClient);
    const productsWithInfo = await daoProducts.getMultipleByIds(
        products.map(({ productId }) => productId),
    );

    const shipping = country === 'US' ? 500 : 1500;
    const productTotal = productsWithInfo.reduce(
        (sum, product) =>
            sum +
            (
                product.price *
                products.find(p => p.productId === product.product_id)?.quantity!
            ),
        0,
    );

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code: CURRENCY_CODE,
                    value: toPPAmount(shipping + productTotal),
                    breakdown: {
                        item_total: {
                            currency_code: CURRENCY_CODE,
                            value: toPPAmount(productTotal),
                        },
                        shipping: {
                            currency_code: CURRENCY_CODE,
                            value: toPPAmount(shipping),
                        },
                        discount: {
                            currency_code: CURRENCY_CODE,
                            value: '0',
                        },
                        handling: {
                            currency_code: CURRENCY_CODE,
                            value: '0',
                        },
                        insurance: {
                            currency_code: CURRENCY_CODE,
                            value: '0',
                        },
                        shipping_discount: {
                            currency_code: CURRENCY_CODE,
                            value: '0',
                        },
                        tax_total: {
                            currency_code: CURRENCY_CODE,
                            value: '0',
                        },
                    },
                },
                items: productsWithInfo.map(product => {
                    const quantity = products
                        .find(reqProduct => reqProduct.productId === product.product_id)
                        ?.quantity!;

                    return {
                        name: product.group_name === product.product_name
                            ? product.product_name
                            : `${product.group_name} - ${product.product_name}`,
                        unit_amount: {
                            currency_code: CURRENCY_CODE,
                            value: toPPAmount(product.price),
                        },
                        quantity: `${quantity}`,
                        category: 'PHYSICAL_GOODS',
                    };
                }),
                shipping: {
                    address: {
                        address_line_1: line1,
                        address_line_2: line2 || '',
                        admin_area_1: state,
                        admin_area_2: city,
                        country_code: country,
                        postal_code: zipCode,
                    },
                    name: {
                        full_name: `${firstName} ${lastName}`,
                    },
                    type: 'SHIPPING',
                },
            }
        ],
    });

    const order = await paypalClient.execute(request).catch(console.error);

    if (!order) {
        return res.status(500).json({ message: 'Could not complete order' });
    }

    console.log(JSON.stringify(order, null, 2));
    console.log('ID IS ', order.result.id);

    const daoPurchases = new DaoPurchases(pgClient);
    await daoPurchases.create(
        order.result.id,
        {
            name: `${firstName} ${lastName}`,
            email,
            line1,
            line2: line2 || '',
            city,
            state,
            zip: zipCode,
            country
        },
        products,
    );

    return res.status(200).json({ id: order.result.id });
}

async function put(
    req: NextApiRequest,
    res: NextApiResponse<GenericError | PurchaseSuccessResponse>,
    pgClient: PGClient,
) {
    const { paypalReference } = req.body;
    const daoPurchases = new DaoPurchases(pgClient);

    const response = await paypalClient.execute(
        new paypal.orders.OrdersCaptureRequest(paypalReference),
    );

    console.log('CAPTURED');
    console.log(JSON.stringify(response, null, 2));

    await daoPurchases.updateStatusByPaypalReference(paypalReference, 'SUCCESS');

    const purchaseInfo = await daoPurchases.getPurchaseInfoByPaypalReference(paypalReference);
    const daoProducts = new DaoProducts(pgClient);
    const productsWithInfo = await daoProducts.getMultipleByIds(
        purchaseInfo.productInfo.map(({ productId }) => productId),
    );

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
        })
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

    if (req.method === 'POST') {
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
            return await post(req, res, pgClient);
        } catch (err) {
            console.log(err);
            return res.status(500).json({message: 'Unknown Server Error'});
        } finally {
            await pgClient.end();
        }
    }

    if (req.method === 'PUT') {
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
            return await put(req, res, pgClient);
        } catch (err) {
            console.log(err);
            return res.status(500).json({message: 'Unknown Server Error'});
        } finally {
            await pgClient.end();
        }
    }

    return res.status(410).json({ message: 'Inavlid Method' });
}

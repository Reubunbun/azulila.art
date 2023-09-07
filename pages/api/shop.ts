import type { NextApiRequest, NextApiResponse } from 'next';
import type {
    GenericError,
    ProductsResult,
    PurchaseRequest,
    PurchaseResponse,
    PurchaseSuccessResponse,
} from 'interfaces';
import { Client as PGClient } from 'pg';
import Stripe from 'stripe';
import { CODE_TO_COUNTRY } from 'helpers/countries';
import DaoProducts from 'dao/Products';
import DaoPurchases from 'dao/Purchases';

const stripe = new Stripe(process.env.STRIPE_SECRET!, { apiVersion: '2023-08-16' });

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
        productGroup.products.sort((a, b) => b.priority - a.priority);
    }
    return res.status(200).json({
        products: productGroups.sort((a, b) => b.priority - a.priority),
        categories: Array.from(
            new Set(productGroups.map(({ mainCategory }) => mainCategory)),
        ),
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

    const itemsForStripe: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const product of productsWithInfo) {
        if (product.is_unavailable) {
            return res.status(500).json({
                message: `Product (${product.group_name}) is no longer available`,
            });
        }

        const quantityForProduct = products
            .find(({ productId }) => productId === product.product_id)
            ?.quantity;

        if (quantityForProduct === undefined) {
            return res.status(500).json({
                message: 'Something went wrong',
            });
        }

        const nameToDisplay = product.group_name === product.product_name
            ?  product.product_name
            : `${product.group_name} - ${product.product_name}`;

        if (product.stock < quantityForProduct) {
            if (quantityForProduct === 1) {
                return res.status(500).json({
                    message: `Product (${nameToDisplay}) is no longer in stock`,
                });
            }

            return res.status(500).json({
                message: `You wanted to purchase ${quantityForProduct} of "${nameToDisplay}", but there is now only ${product.stock} available`,
            });
        }

        itemsForStripe.push({
            price_data: {
                currency: 'usd',
                unit_amount: product.price,
                product_data: { name: nameToDisplay },
            },
            quantity: quantityForProduct,
        })
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: [ 'card', 'paypal' ],
        mode: 'payment',
        success_url: `${process.env.DOMAIN}/secret-shop/success?id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.DOMAIN}/secret-shop/cancel?id={CHEKOUT_SESSION_ID}`,
        line_items: itemsForStripe,
        shipping_options: [{
            shipping_rate: country === 'US'
                ? 'shr_1NnQrKB1kXMeBzkB8keTH3Dz'
                : 'shr_1NnQryB1kXMeBzkBGiEdXKil'
        }],
        customer_email: email,
        payment_intent_data: {
            shipping: {
                name: `${firstName} ${lastName}`,
                address: {
                    country,
                    state,
                    city,
                    line1,
                    line2: line2 || '',
                    postal_code: zipCode,
                },
            },
        },
    }).catch(console.error);

    if (!session || !session.url) {
        return res.status(500).json({
            message: 'Checkout session could not be created',
        });
    }

    const daoPurchases = new DaoPurchases(pgClient);
    await daoPurchases.create(
        session.id,
        {
            name: `${firstName} ${lastName}`,
            email,
            line1,
            line2: line2 || '',
            city,
            state,
            zip: zipCode,
            country: CODE_TO_COUNTRY[country],
        },
        products,
    );

    return res.status(200).json({
        url: session.url,
    });
}

async function put(
    req: NextApiRequest,
    res: NextApiResponse<GenericError | PurchaseSuccessResponse>,
    pgClient: PGClient,
) {
    const { stripeReference, status } = req.body;
    console.log({ stripeReference, status });
    const daoPurchases = new DaoPurchases(pgClient);
    await daoPurchases.updateStatusByStripeReference(stripeReference, status);

    if (status === 'SUCCESS') {
        const purchaseInfo = await daoPurchases.getPurchaseInfoByStripReference(
            stripeReference,
        );

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
                }
            }),
        });
    }

    return res.status(201);
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

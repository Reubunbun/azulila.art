import type { NextApiRequest, NextApiResponse } from 'next';
import type { GenericError, ProductsResult, PurchaseRequest } from 'interfaces';
import { Client as PGClient } from 'pg';
import { CODES } from 'helpers/countries';
import Stripe from 'stripe';
import DaoProducts from 'dao/Products';

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
            product.actualPrice = Number((product.actualPrice / 100).toFixed(2));
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
    res: NextApiResponse<GenericError>,
    pgClient: PGClient,
) {
    const {
        firstName,
        lastName,
        email,
        line1,
        line2,
        line3,
        city,
        zipCode,
        state,
        country,
        coupon,
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

        const quantityForProduct = products.find(({ productId }) => productId === product.product_id)?.quantity;
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
        success_url: 'https://google.com',
        cancel_url: 'https://google.com',
        line_items: itemsForStripe,
        shipping_options: [{
            shipping_rate: country === 'United States'
                ? 'shr_1NnQrKB1kXMeBzkB8keTH3Dz'
                : 'shr_1NnQryB1kXMeBzkBGiEdXKil'
        }],
        customer_email: email,
        shipping_address_collection: {
            allowed_countries: CODES as
                Stripe
                .Checkout
                .SessionCreateParams
                .ShippingAddressCollection
                .AllowedCountry[]
        },
    });

    console.log(session);
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

    return res.status(410).json({ message: 'Inavlid Method' });
}

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
import Handlebars from 'handlebars';
import aws from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import DaoProducts from 'dao/Products';
import DaoPurchases from 'dao/Purchases';
import { CODE_TO_COUNTRY } from 'helpers/countries';

const Environment = process.env.NODE_ENV === 'development'
    ? paypal.core.SandboxEnvironment
    : paypal.core.LiveEnvironment;

const paypalClient = new paypal.core.PayPalHttpClient(
    new Environment(
        process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        process.env.PAYPAL_SECRET!
    ),
);
const CURRENCY_CODE = 'USD';
const toPPAmount = (amount: number) => (amount / 100).toFixed(2);

const sesClient = new aws.SES({
    region: 'eu-west-1',
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
});

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

    const allProductIds = products.map(({ productId }) => productId);

    const daoProducts = new DaoProducts(pgClient);

    const stockByProductId = await daoProducts.getStockForMultipleProducts(
        allProductIds,
    );

    const productsWithInfo = await daoProducts.getMultipleByIds(
        allProductIds,
    );

    const productsOutOfStock: {name: string, stock: number}[] = [];

    const allUSShipping = [];
    const allIntShipping = [];

    for (const product of productsWithInfo) {
        allUSShipping.push(product.shipping_us);
        allIntShipping.push(product.shipping_int);

        const quantity = products
            .find(reqProduct => reqProduct.productId === product.product_id)
            ?.quantity!;

        if (stockByProductId[product.product_id] < quantity) {
            productsOutOfStock.push({
                name: product.group_name === product.product_name
                    ? product.group_name
                    : `${product.group_name} - ${product.product_name}`,
                stock: stockByProductId[product.product_id],
            });
        }
    }

    if (productsOutOfStock.length) {
        return res.status(410).json({
            message: 'Not enough stock remaining for some items, please adjust your basket:\n'
                + productsOutOfStock.map(({ name, stock }) => `${name}: stock remaining ${stock}`).join('\n'),
        });
    }

    const shipping = country === 'US'
        ? Math.max(...allUSShipping)
        : Math.max(...allIntShipping);

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
    res: NextApiResponse<GenericError | void>,
    pgClient: PGClient,
) {
    const { paypalReference } = req.body;
    const daoPurchases = new DaoPurchases(pgClient);

    const response = await paypalClient.execute(
        new paypal.orders.OrdersCaptureRequest(paypalReference),
    );

    console.log('CAPTURED');
    console.log(JSON.stringify(response, null, 2));

    try {
        await daoPurchases.updateStatusByPaypalReference(paypalReference, 'SUCCESS');

        const purchaseInfo = await daoPurchases.getPurchaseInfoByPaypalReference(paypalReference);

        const daoProducts = new DaoProducts(pgClient);

        for (const product of purchaseInfo.productInfo) {
            await daoProducts.reduceStockForProduct(product.productId, product.quantity);
        }

        const productsWithInfo = await daoProducts.getMultipleByIds(
            purchaseInfo.productInfo.map(({ productId }) => productId),
        );

        const allUSShipping = [];
        const allIntShipping = [];

        for (const product of productsWithInfo) {
            allUSShipping.push(product.shipping_us);
            allIntShipping.push(product.shipping_int);
        }

        const shipping = purchaseInfo.contactInfo.country === 'US'
            ? Number((Math.max(...allUSShipping) / 100).toFixed(2))
            : Number((Math.max(...allIntShipping) / 100).toFixed(2));

        const productTotal = purchaseInfo.productInfo.reduce(
            (sum, product) =>
                sum +
                (
                    product.quantity *
                    productsWithInfo.find(p => p.product_id === product.productId)?.price!
                ),
            0,
        ) / 100;

        const rawTemplate = fs.readFileSync(
            path.resolve('./templates', 'order.handlebars'),
            'utf-8',
        );
        const html = Handlebars.compile(rawTemplate)({
            ItemTotal: productTotal.toFixed(2),
            ShippingTotal: shipping,
            TotalPrice: (shipping + productTotal).toFixed(2),
            Email: purchaseInfo.contactInfo.email,
            PaypalReference: paypalReference,
            Name: purchaseInfo.contactInfo.name,
            Line1: purchaseInfo.contactInfo.line1,
            Line2: purchaseInfo.contactInfo.line2,
            City: purchaseInfo.contactInfo.city,
            State: purchaseInfo.contactInfo.state,
            Zip: purchaseInfo.contactInfo.zip,
            Country: CODE_TO_COUNTRY[purchaseInfo.contactInfo.country],
            Items: purchaseInfo.productInfo.map(({ productId, quantity }) => {
                const product = productsWithInfo.find(product => productId === product.product_id)!;

                return {
                    Name: product.group_name === product.product_name
                        ? product.group_name
                        : `${product.group_name} - ${product.product_name}`,
                    Price: ((product.price * quantity) / 100).toFixed(2),
                    Quantity: quantity,
                };
            })
        });

        await sesClient.sendEmail({
            Destination: {
                ToAddresses: ['reuben.luke.p@gmail.com', 'azulilah.art@gmail.com'],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: html,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: `New Shop Order via Azulilah Website!`
                },
            },
            Source: 'reuben.luke.p@gmail.com',
        }).promise();
    } catch (err) {
        await sesClient.sendEmail({
            Destination: {
                ToAddresses: ['reuben.luke.p@gmail.com'],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: `There was some non fatal error in order PUT: ${(err as any).message}`,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: `Error in azulilah.art order PUT`
                },
            },
            Source: 'reuben.luke.p@gmail.com',
        }).promise().catch(console.error);
    }

    return res.status(201).json();
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GenericError | ProductsResult | PurchaseResponse | PurchaseSuccessResponse | void>,
) {
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
            await sesClient.sendEmail({
                Destination: {
                    ToAddresses: ['reuben.luke.p@gmail.com'],
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: 'UTF-8',
                            Data: `Method: POST <br> Error: ${(err as any).message}`,
                        },
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: 'Error in azulilah orders api'
                    },
                },
                Source: 'reuben.luke.p@gmail.com',
            }).promise().catch(console.error);
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
            await sesClient.sendEmail({
                Destination: {
                    ToAddresses: ['reuben.luke.p@gmail.com'],
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: 'UTF-8',
                            Data: `Method: PUT <br> Error: ${(err as any).message}`,
                        },
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: 'Error in azulilah orders api'
                    },
                },
                Source: 'reuben.luke.p@gmail.com',
            }).promise().catch(console.error);
            return res.status(500).json({message: 'Unknown Server Error'});
        } finally {
            await pgClient.end();
        }
    }

    return res.status(410).json({ message: 'Inavlid Method' });
}

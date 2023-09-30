import AbstractDao from './abstract';
import type { ContactInfo, ProductInfo } from 'interfaces';

const TABLE_NAME = 'tania_purchases';
const COL_CONTACT_INFO = 'contact_info';
const COL_PRODUCT_INFO = 'product_info';
const COL_TIME_OF_PURCHASE = 'time_of_purchase';
const COL_STATUS = 'status';
const COL_PAYPAL_REFERENCE = 'paypal_reference';

type PurchaseInfo = {
    contactInfo: ContactInfo;
    productInfo: ProductInfo;
}

export default class Purchases extends AbstractDao {
    async create(
        paypalReference: string,
        contactInfo: ContactInfo,
        productInfo: ProductInfo,
    ) : Promise<void> {
        await this.pgClient.query(
            this.knexClient(TABLE_NAME)
                .insert({
                    [COL_PAYPAL_REFERENCE]: paypalReference,
                    [COL_CONTACT_INFO]: JSON.stringify(contactInfo),
                    [COL_PRODUCT_INFO]: JSON.stringify(productInfo),
                    [COL_TIME_OF_PURCHASE]: Math.floor(Date.now() / 1000),
                    [COL_STATUS]: 'CREATED',
                })
                .toString(),
        );
    }

    async updateStatusByPaypalReference(
        paypalReference: string,
        status: string,
    ) : Promise<void> {
        await this.pgClient.query(
            this.knexClient(TABLE_NAME)
                .update({ [COL_STATUS]: status })
                .where(COL_PAYPAL_REFERENCE, paypalReference)
                .toString(),
        );
    }

    async getPurchaseInfoByPaypalReference(paypalReference: string) : Promise<PurchaseInfo> {
        const results = (await this.pgClient.query(
            this.knexClient(TABLE_NAME)
                .select(COL_CONTACT_INFO)
                .select(COL_PRODUCT_INFO)
                .where(COL_PAYPAL_REFERENCE, paypalReference)
                .toString(),
        )).rows;

        if (!results.length) {
            throw new Error('Could not find info for reference');
        }

        console.log(results[0]);

        return {
            contactInfo: results[0][COL_CONTACT_INFO],
            productInfo: results[0][COL_PRODUCT_INFO],
        };
    }
}

import AbstractDao from './abstract';
import type { ProductGroup, ProductsResult } from '../interfaces';

const COL_GROUP_ID = 'group_id';
const COL_NAME = 'name';
const ALIAS_GROUP_NAME = 'group_name';
const COL_DESCRIPTION = 'description';
const COL_PRIORITY = 'priority';
const COL_IMG_URL = 'img_url';
const COL_IMG_WIDTH = 'img_width';
const COL_IMG_HEIGHT = 'img_height';
const COL_IS_UNAVAILABLE = 'is_unavailable';
const COL_TYPE = 'type';

const COL_PRODUCT_ID = 'product_id';
const ALIAS_PRODUCT_NAME = 'product_name';
const COL_PRICE = 'price';
const COL_OFFER = 'offer';
const ALIAS_PRODUCT_UNAVAILBALE = 'product_is_unavailable';

const COL_TAG_NAME = 'tag_name';

interface JoinedProductRow {
    [COL_GROUP_ID]: number;
    [COL_PRODUCT_ID]: number;
    [ALIAS_GROUP_NAME]: string;
    [ALIAS_PRODUCT_NAME]: string;
    [COL_DESCRIPTION]: string;
    [COL_PRIORITY]: number;
    [COL_IMG_URL]: string;
    [COL_IMG_WIDTH]: number;
    [COL_IMG_HEIGHT]: number;
    [ALIAS_PRODUCT_UNAVAILBALE]: boolean;
    [COL_PRICE]: number;
    [COL_OFFER]: number;
    [COL_TAG_NAME]: string;
    [COL_TYPE]: string;
};

export default class Products extends AbstractDao {
    static readonly GROUP_TABLE_NAME: string = 'tania_product_group';
    static readonly PRODUCT_TABLE_NAME: string = 'tania_product';
    static readonly TAGS_TABLE_NAME: string = 'tania_product_tags';

    async getAll() : Promise<ProductsResult> {
        const results = (await this.pgClient.query<JoinedProductRow>(
            this.knexClient(Products.GROUP_TABLE_NAME)
                .select({
                    [COL_GROUP_ID]: `${Products.GROUP_TABLE_NAME}.${COL_GROUP_ID}`
                })
                .select(COL_PRODUCT_ID)
                .select({
                    [ALIAS_GROUP_NAME]: `${Products.GROUP_TABLE_NAME}.${COL_NAME}`
                })
                .select({
                    [ALIAS_PRODUCT_NAME]: `${Products.PRODUCT_TABLE_NAME}.${COL_NAME}`
                })
                .select(COL_DESCRIPTION)
                .select(COL_PRIORITY)
                .select({
                    [COL_IMG_URL]: `${Products.GROUP_TABLE_NAME}.${COL_IMG_URL}`,
                })
                .select({
                    [COL_IMG_WIDTH]: `${Products.GROUP_TABLE_NAME}.${COL_IMG_WIDTH}`,
                })
                .select({
                    [COL_IMG_HEIGHT]: `${Products.GROUP_TABLE_NAME}.${COL_IMG_HEIGHT}`,
                })
                .select({
                    [ALIAS_PRODUCT_UNAVAILBALE]:
                        `${Products.PRODUCT_TABLE_NAME}.${COL_IS_UNAVAILABLE}`
                })
                .select(COL_PRICE)
                .select(COL_OFFER)
                .select(COL_TAG_NAME)
                .select(COL_TYPE)
                .leftJoin(
                    Products.PRODUCT_TABLE_NAME,
                    `${Products.GROUP_TABLE_NAME}.${COL_GROUP_ID}`,
                    `${Products.PRODUCT_TABLE_NAME}.${COL_GROUP_ID}`,
                )
                .leftJoin(
                    Products.TAGS_TABLE_NAME,
                    `${Products.GROUP_TABLE_NAME}.${COL_GROUP_ID}`,
                    `${Products.TAGS_TABLE_NAME}.${COL_GROUP_ID}`,
                )
                .where(`${Products.GROUP_TABLE_NAME}.${COL_IS_UNAVAILABLE}`, false)
                .orderBy(COL_PRIORITY, 'desc')
                .toString(),
        )).rows;

        const productGroupsById = new Map<number, ProductGroup>();
        for (const row of results) {
            const groupId = row[COL_GROUP_ID];
            const price = row[COL_PRICE];
            const offerAsPercent = (row[COL_OFFER] / 100);
            const actualPrice = price - (price * offerAsPercent);

            if (!productGroupsById.has(groupId)) {
                productGroupsById.set(
                    groupId,
                    {
                        groupId,
                        name: row[ALIAS_GROUP_NAME],
                        priority: row[COL_PRIORITY],
                        imageUrl: row[COL_IMG_URL],
                        imageWidth: row[COL_IMG_WIDTH],
                        imageHeight: row[COL_IMG_HEIGHT],
                        products: [
                            {
                                productId: row[COL_PRODUCT_ID],
                                groupId,
                                name: row[ALIAS_PRODUCT_NAME],
                                description: row[COL_DESCRIPTION],
                                price,
                                offer: row[COL_OFFER],
                                isUnavailable: row[ALIAS_PRODUCT_UNAVAILBALE],
                                actualPrice,
                            },
                        ],
                        tags: [ row[COL_TAG_NAME] ],
                        mainCategory: row[COL_TYPE],
                    },
                );

                continue;
            }

            const existingGroupDetails = productGroupsById.get(groupId)!;
            const nextTagName = row[COL_TAG_NAME];
            const nextProductId = row[COL_PRODUCT_ID];

            if (!existingGroupDetails.tags.includes(nextTagName)) {
                existingGroupDetails.tags.push(nextTagName);
            }

            const alreadyHasProduct = existingGroupDetails.products.some(
                product => product.productId === nextProductId,
            );
            if (!alreadyHasProduct) {
                existingGroupDetails.products.push({
                    productId: nextProductId,
                    groupId,
                    name: row[ALIAS_PRODUCT_NAME],
                    description: row[COL_DESCRIPTION],
                    price,
                    offer: row[COL_OFFER],
                    isUnavailable: row[ALIAS_PRODUCT_UNAVAILBALE],
                    actualPrice,
                });
            }
        }

        return { productGroups: Array.from(productGroupsById.values()) };
    }
}

import AbstractDao from './abstract';
import type { ProductGroup } from '../interfaces';

const COL_GROUP_ID = 'group_id';
const COL_NAME = 'name';
const ALIAS_GROUP_NAME = 'group_name';
const COL_DESCRIPTION = 'description';
const COL_PRIORITY = 'priority';
const ALIAS_GROUP_PRIORITY = 'group_priority';
const COL_IMG_URL = 'img_url';
const COL_IS_UNAVAILABLE = 'is_unavailable';
const COL_TYPE = 'type';

const COL_PRODUCT_ID = 'product_id';
const ALIAS_PRODUCT_NAME = 'product_name';
const COL_PRICE = 'price';
const COL_STOCK = 'stock';
const ALIAS_PRODUCT_PRIORITY = 'product_priority';

const COL_TAG_NAME = 'tag_name';

interface JoinedProductRow {
    [COL_GROUP_ID]: number;
    [COL_PRODUCT_ID]: number;
    [ALIAS_GROUP_NAME]: string;
    [ALIAS_PRODUCT_NAME]: string;
    [COL_DESCRIPTION]: string;
    [ALIAS_GROUP_PRIORITY]: number;
    [COL_IMG_URL]: string;
    [COL_STOCK]: number;
    [COL_PRICE]: number;
    [COL_TAG_NAME]: string;
    [COL_TYPE]: string;
    [ALIAS_PRODUCT_PRIORITY]: number;
};

type FullProductInfo = Omit<JoinedProductRow, 'tag_name'> & {
    [COL_IS_UNAVAILABLE]: boolean;
};

export default class Products extends AbstractDao {
    static readonly GROUP_TABLE_NAME: string = 'tania_product_group';
    static readonly PRODUCT_TABLE_NAME: string = 'tania_product';
    static readonly TAGS_TABLE_NAME: string = 'tania_product_tags';

    async getAll() : Promise<ProductGroup[]> {
        const results = (await this.pgClient.query<JoinedProductRow>(
            this.knexClient(Products.GROUP_TABLE_NAME)
                .select({
                    [COL_GROUP_ID]: `${Products.GROUP_TABLE_NAME}.${COL_GROUP_ID}`,
                })
                .select(COL_PRODUCT_ID)
                .select({
                    [ALIAS_GROUP_NAME]: `${Products.GROUP_TABLE_NAME}.${COL_NAME}`,
                })
                .select({
                    [ALIAS_PRODUCT_NAME]: `${Products.PRODUCT_TABLE_NAME}.${COL_NAME}`,
                })
                .select(COL_DESCRIPTION)
                .select({
                    [ALIAS_GROUP_PRIORITY]: `${Products.GROUP_TABLE_NAME}.${COL_PRIORITY}`,
                })
                .select({
                    [ALIAS_PRODUCT_PRIORITY]: `${Products.PRODUCT_TABLE_NAME}.${COL_PRIORITY}`,
                })
                .select({
                    [COL_IMG_URL]: `${Products.GROUP_TABLE_NAME}.${COL_IMG_URL}`,
                })
                .select(COL_STOCK)
                .select(COL_PRICE)
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
                .toString(),
        )).rows;

        const productGroupsById = new Map<number, ProductGroup>();
        for (const row of results) {
            const groupId = row[COL_GROUP_ID];
            const price = row[COL_PRICE];

            if (!productGroupsById.has(groupId)) {
                productGroupsById.set(
                    groupId,
                    {
                        groupId,
                        name: row[ALIAS_GROUP_NAME],
                        priority: row[ALIAS_GROUP_PRIORITY],
                        imageUrl: row[COL_IMG_URL],
                        products: [
                            {
                                productId: row[COL_PRODUCT_ID],
                                groupId,
                                name: row[ALIAS_PRODUCT_NAME],
                                price,
                                stock: row[COL_STOCK],
                                priority: row[ALIAS_PRODUCT_PRIORITY],
                            },
                        ],
                        tags: [ row[COL_TAG_NAME] ].filter(Boolean),
                        mainCategory: row[COL_TYPE],
                        description: row[COL_DESCRIPTION],
                    },
                );

                continue;
            }

            const existingGroupDetails = productGroupsById.get(groupId)!;
            const nextTagName = row[COL_TAG_NAME];
            const nextProductId = row[COL_PRODUCT_ID];

            if (nextTagName && !existingGroupDetails.tags.includes(nextTagName)) {
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
                    price,
                    stock: row[COL_STOCK],
                    priority: row[ALIAS_PRODUCT_PRIORITY],
                });
            }
        }

        return Array.from(productGroupsById.values());
    }

    async getMultipleByIds(
        productIds: number[],
    ) : Promise<FullProductInfo[]> {
        return (await this.pgClient.query<FullProductInfo>(
            this.knexClient(Products.GROUP_TABLE_NAME)
                .select({
                    [COL_GROUP_ID]: `${Products.GROUP_TABLE_NAME}.${COL_GROUP_ID}`,
                })
                .select(COL_PRODUCT_ID)
                .select({
                    [ALIAS_GROUP_NAME]: `${Products.GROUP_TABLE_NAME}.${COL_NAME}`,
                })
                .select({
                    [ALIAS_PRODUCT_NAME]: `${Products.PRODUCT_TABLE_NAME}.${COL_NAME}`,
                })
                .select(COL_DESCRIPTION)
                .select({
                    [ALIAS_GROUP_PRIORITY]: `${Products.GROUP_TABLE_NAME}.${COL_PRIORITY}`,
                })
                .select({
                    [ALIAS_PRODUCT_PRIORITY]: `${Products.PRODUCT_TABLE_NAME}.${COL_PRIORITY}`,
                })
                .select({
                    [COL_IMG_URL]: `${Products.GROUP_TABLE_NAME}.${COL_IMG_URL}`,
                })
                .select(COL_STOCK)
                .select(COL_PRICE)
                .select(COL_TYPE)
                .select(COL_IS_UNAVAILABLE)
                .leftJoin(
                    Products.PRODUCT_TABLE_NAME,
                    `${Products.GROUP_TABLE_NAME}.${COL_GROUP_ID}`,
                    `${Products.PRODUCT_TABLE_NAME}.${COL_GROUP_ID}`,
                )
                .whereIn(COL_PRODUCT_ID, productIds)
                .toString(),
        )).rows;
    }
}

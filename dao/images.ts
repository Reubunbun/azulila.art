import type { Image } from '../interfaces';
import AbstractDao from './abstract';
import DaoTags from './tags';

const COL_IMG_ID = 'image_id';
const COL_KEY = 'key';
const COL_URL = 'url';
const COL_TITLE = 'title';
const COL_DESCRIPTION = 'description';
const COL_PRIORITY = 'priority';
const COL_WIDTH = 'width';
const COL_HEIGHT = 'height';

const RES_TOTAL_COUNT = 'TotalCount';

interface ImageRow {
    [COL_IMG_ID]: number;
    [COL_KEY]: string;
    [COL_URL]: string;
    [COL_TITLE]: string;
    [COL_DESCRIPTION]: string;
    [COL_PRIORITY]: number;
    [COL_WIDTH]: number;
    [COL_HEIGHT]: number;
    [DaoTags.COL_TAG_NAME]: string;
};
interface CountRow {
    [RES_TOTAL_COUNT]: number;
};
interface ImagesResults {
    images: Image[],
    totalCount: number,
};

export default class PortfolioImages extends AbstractDao {
    static readonly TABLE_NAME: string = 'tania_portfolio_images';

    async getAllByTags(
        page: number,
        limit: number,
        tags: string[] | null,
    ) : Promise<ImagesResults>
    {
        const selectQuery = this.knexClient(PortfolioImages.TABLE_NAME);
        const countQuery = this.knexClient(PortfolioImages.TABLE_NAME)
            .countDistinct(`${COL_URL} as ${RES_TOTAL_COUNT}`);

        if (tags) {
            countQuery
                .leftJoin(
                    DaoTags.TABLE_NAME,
                    `${PortfolioImages.TABLE_NAME}.${COL_IMG_ID}`,
                    `${DaoTags.TABLE_NAME}.${DaoTags.COL_IMAGE_ID}`
                )
                .whereIn(DaoTags.COL_TAG_NAME, tags);

            selectQuery
                .select(this.knexClient.raw(
                    `${PortfolioImages.TABLE_NAME}.*, ${DaoTags.TABLE_NAME}.${DaoTags.COL_TAG_NAME}`
                ))
                .leftJoin(
                    DaoTags.TABLE_NAME,
                    `${PortfolioImages.TABLE_NAME}.${COL_IMG_ID}`,
                    `${DaoTags.TABLE_NAME}.${DaoTags.COL_IMAGE_ID}`
                )
                .whereIn(DaoTags.COL_TAG_NAME, tags);
        } else {
            selectQuery.select();
        }

        selectQuery
            .orderBy(COL_PRIORITY)
            .limit(limit)
            .offset(page * limit);

        console.log(selectQuery.toString());
        let imagesResults: ImageRow[] = [];
        let countResult: CountRow[] = [];

        await Promise.all([
            this.createQuery(countQuery.toString())
                .then(res => countResult.push(...res)),
            this.createQuery(selectQuery.toString())
                .then(res => imagesResults.push(...res)),
        ]);

        const indexedImages = imagesResults.reduce(
            (indexedImages, imageRow) => {
                const currImgId = imageRow[COL_IMG_ID];
                const image = indexedImages[currImgId];

                if (image) {
                    return {
                        ...indexedImages,
                        [currImgId]: {
                            ...image,
                            tags: [
                                ...(image.tags || []),
                                imageRow[DaoTags.COL_TAG_NAME],
                            ]
                        },
                    };
                }

                return {
                    ...indexedImages,
                    [currImgId]: {
                        id: imageRow[COL_IMG_ID],
                        url: imageRow[COL_URL],
                        title: imageRow[COL_TITLE],
                        description: imageRow[COL_DESCRIPTION],
                        priority: imageRow[COL_PRIORITY],
                        width: imageRow[COL_WIDTH],
                        height: imageRow[COL_HEIGHT],
                        tags: [],
                    },
                };
            },
            {} as {[imageId: number]: Image}
        );

        return {
            images: Object.values(indexedImages)
                .sort((a, b) => a[COL_PRIORITY] - b[COL_PRIORITY])
                .map(
                    image => ({
                        ...image,
                        tags: image.tags.filter(tag=>tag),
                    }),
                ),
            totalCount: countResult[0][RES_TOTAL_COUNT],
        }
    }
}

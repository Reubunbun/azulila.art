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

interface ImagesResults {
    images: Image[],
};

export default class PortfolioImages extends AbstractDao {
    static readonly TABLE_NAME: string = 'tania_images';

    async getAll() : Promise<ImagesResults> {
        const results = (await this.pgClient.query<ImageRow>(
            this.knexClient(PortfolioImages.TABLE_NAME)
                .select(this.knexClient.raw(
                    `${PortfolioImages.TABLE_NAME}.*, ${DaoTags.TABLE_NAME}.${DaoTags.COL_TAG_NAME}`
                ))
                .leftJoin(
                    DaoTags.TABLE_NAME,
                    `${PortfolioImages.TABLE_NAME}.${COL_IMG_ID}`,
                    `${DaoTags.TABLE_NAME}.${DaoTags.COL_IMAGE_ID}`,
                )
                .orderBy(COL_PRIORITY)
                .toString()
        )).rows;

        const indexedImages = results.reduce(
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
                        tags: [imageRow[DaoTags.COL_TAG_NAME]],
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
        };
    }
}

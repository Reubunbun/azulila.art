import type { Connection } from 'mysql';
import type { Knex } from 'knex';
import type { Image } from '../interfaces';
import Util from 'util';
import KnexInitialiser from 'knex';

interface Tags {
    [key: string]: number;
}

const COL_TAG_NAME = 'tag_name';
const COL_BIT_FLAG = 'bit_flag';
interface TagRow {
    [COL_TAG_NAME]: string,
    [COL_BIT_FLAG]: number,
};

const COL_IMG_ID = 'image_id';
const COL_KEY = 'key';
const COL_URL = 'url';
const COL_TITLE = 'title';
const COL_DESCRIPTION = 'description';
const COL_TAGS = 'tags';
const COL_PRIORITY = 'priority';
const COL_WIDTH = 'width';
const COL_HEIGHT = 'height';

interface ImageRow {
    [COL_IMG_ID]: number;
    [COL_KEY]: string;
    [COL_URL]: string;
    [COL_TITLE]: string;
    [COL_DESCRIPTION]: string;
    [COL_TAGS]: number;
    [COL_PRIORITY]: number;
    [COL_WIDTH]: number;
    [COL_HEIGHT]: number;
};
interface CountRow {
    'count(*)': number;
};
interface ImagesResults {
    images: Image[],
    totalCount: number,
};

class PortfolioImages {
    private createQuery: (query: string) => Promise<any>;
    private knexClient: Knex;

    static readonly TABLE_NAME: string = 'tania_portfolio_images';
    static readonly TAGS_TABLE_NAME: string = 'tania_portfolio_tags';

    constructor(connSQL: Connection) {
        this.createQuery = Util.promisify(connSQL.query).bind(connSQL);
        this.knexClient = KnexInitialiser({
            client: require('knex-serverless-mysql')
        });
    }

    async getTags(): Promise<Tags> {
        const query = this.knexClient(PortfolioImages.TAGS_TABLE_NAME)
            .select()
            .toString();

        const allRows = await this.createQuery(query) as TagRow[];

        if (!allRows || !allRows.length) {
            return {};
        }

        return allRows.reduce((prev: Tags, curr: TagRow): Tags => ({
            ...prev,
            [curr[COL_TAG_NAME]]: curr[COL_BIT_FLAG],
        }), {});
    }

    async getImages(
        tagBits: number,
        page: number,
        limit: number,
        tags: Tags,
    ) : Promise<ImagesResults>
    {
        const selectQuery = this.knexClient(PortfolioImages.TABLE_NAME)
            .select();
        const countQuery = this.knexClient(PortfolioImages.TABLE_NAME)
            .count('*');

        if (tagBits) {
            selectQuery.where(
                this.knexClient.raw(`${COL_TAGS} & ${tagBits} > 0`),
            );
            countQuery.where(
                this.knexClient.raw(`${COL_TAGS} & ${tagBits} > 0`),
            );
        }

        selectQuery
            .orderBy(COL_PRIORITY, 'asc')
            .limit(limit)
            .offset(page * limit);

        const imgResults: ImageRow[] = [];
        const countResult: CountRow[] = [];
        await Promise.all([
            this.createQuery(selectQuery.toString())
                .then((res: ImageRow[]) => imgResults.push(...res)),
            this.createQuery(countQuery.toString())
                .then((res: CountRow[]) => countResult.push(...res)),
        ]);

        const tagsSwapped: {[key: number]: string} = Object.keys(tags).reduce(
            (prev: object, curr: string): object => ({
                ...prev,
                [tags[curr]]: curr,
            }),
            {},
        );

        return {
            images: imgResults.map(img => ({
                id: img[COL_IMG_ID],
                url: img[COL_URL],
                title: img[COL_TITLE],
                description: img[COL_DESCRIPTION],
                tags: img[COL_TAGS]
                    .toString(2)
                    .split('')
                    .map((char, i) => tagsSwapped[(+char) * 2**i])
                    .filter(bit => bit),
                priority: img[COL_PRIORITY],
                width: img[COL_WIDTH],
                height: img[COL_HEIGHT],
            })),
            totalCount: countResult[0]['count(*)'],
        };
    }
}

export default PortfolioImages;

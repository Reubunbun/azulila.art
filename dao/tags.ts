import AbstractDao from './abstract';

const COL_IMAGE_ID = 'image_id';
const COL_TAG_NAME = 'tag_name';

interface TagRow {
    [COL_IMAGE_ID]: number;
    [COL_TAG_NAME]: string;
};

export default class Tags extends AbstractDao {
    static readonly TABLE_NAME = 'tania_tags';
    static readonly COL_IMAGE_ID = COL_IMAGE_ID;
    static readonly COL_TAG_NAME = COL_TAG_NAME;

    public async getAll(): Promise<string[]> {
        const allRows: TagRow[] = await this.createQuery(
            this.knexClient(Tags.TABLE_NAME)
                .distinct(COL_TAG_NAME)
                .toString(),
        );

        return allRows.map(tagRow => tagRow[COL_TAG_NAME]);
    }
}

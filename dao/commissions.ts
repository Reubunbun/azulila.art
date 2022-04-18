import AbstractDao from './abstract';

const COL_NUM_SPACES = 'num_spaces';

interface CommissionRow {
    [COL_NUM_SPACES]: number;
};

export default class CommissionSpaces extends AbstractDao {
    static readonly TABLE_NAME: string = 'tania_portfolio_comm_spaces';

    async getNumSpaces(): Promise<number> {
        const queryResult: CommissionRow[] = await this.createQuery(
            this.knexClient(CommissionSpaces.TABLE_NAME)
                .select(COL_NUM_SPACES)
                .toString(),
        );

        if (!queryResult?.length) {
            throw new Error('Unable to find number of spaces');
        }

        return queryResult[0][COL_NUM_SPACES];
    }
};

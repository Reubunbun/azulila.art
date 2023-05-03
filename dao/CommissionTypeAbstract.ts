import AbstractDao from './abstract';

export interface CommissionTypeRow {
  display: string;
  price: number;
  offer: number | null;
  example_url: string;
};

export default abstract class CommissionTypeAbstract extends AbstractDao {
  protected abstract getTableName() : string;

  protected async _getAll(): Promise<CommissionTypeRow[]> {
    return (await this.pgClient.query<CommissionTypeRow>(
      this.knexClient(this.getTableName())
        .select()
        .orderBy('price', 'asc')
        .toString(),
    )).rows;
  }
}

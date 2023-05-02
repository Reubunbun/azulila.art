import type { CommissionTypeRow } from './CommissionTypeAbstract';
import type { CommissionType } from '../interfaces';
import CommissionTypeAbstract from './CommissionTypeAbstract';

interface CommissionBackgroundTypeRow extends CommissionTypeRow {
  background_id: number;
};

export default class CommissionBackgroundType extends CommissionTypeAbstract {
  protected getTableName() : string {
    return 'tania_comm_bgs';
  }

  public async getAll() : Promise<CommissionType[]> {
    const rows = await super._getAll() as CommissionBackgroundTypeRow[];
    return rows.map(row => ({
      id: row.background_id,
      display: row.display,
      price: row.price,
      offer: row.offer,
      exampleImage: row.example_url,
    }))
  };
}

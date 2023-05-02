import type { CommissionTypeRow } from './CommissionTypeAbstract';
import type { CommissionType } from '../interfaces';
import CommissionTypeAbstract from './CommissionTypeAbstract';

interface CommissionBaseTypeRow extends CommissionTypeRow {
  type_id: number;
};

export default class CommissionBaseType extends CommissionTypeAbstract {
  protected getTableName() : string {
    return 'tania_comm_types';
  }

  public async getAll() : Promise<CommissionType[]> {
    const rows = await super._getAll() as CommissionBaseTypeRow[];
    return rows.map(row => ({
      id: row.type_id,
      display: row.display,
      price: row.price,
      offer: row.offer,
      exampleImage: row.example_url,
    }))
  };
}

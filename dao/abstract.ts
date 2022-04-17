import type { Connection } from 'mysql';
import type { Knex } from 'knex';
import Util from 'util';
import KnexInitialiser from 'knex';

export default abstract class AbstractDao {
    protected readonly createQuery: (query: string) => Promise<any>;
    protected readonly knexClient: Knex;

    constructor(connSQL: Connection) {
        this.createQuery = Util.promisify(connSQL.query).bind(connSQL);
        this.knexClient = KnexInitialiser({
            client: require('knex-serverless-mysql'),
        });
    }
};

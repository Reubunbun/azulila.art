import { Client as PGClient } from 'pg';
import type { Knex } from 'knex';
import KnexInitialiser from 'knex';

export default abstract class AbstractDao {
    protected readonly knexClient: Knex;
    protected readonly pgClient: PGClient;

    constructor(pgClient: PGClient) {
        this.pgClient = pgClient;
        this.knexClient = KnexInitialiser({
            client: 'pg',
        });
    }
};

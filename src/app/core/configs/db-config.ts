import { dbMigrationFactory } from './db-migration-factory';
import { IdbCfg } from '../../idb/idb-cfg.interface';

export const dbConfig: IdbCfg = {
  name: 'random-tasks-generator-db',
  version: 4,
  migrationFactory: dbMigrationFactory
};

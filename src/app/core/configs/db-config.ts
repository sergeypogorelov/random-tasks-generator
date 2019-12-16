import { DBConfig } from 'ngx-indexed-db';

import { dbMigrationFactory } from './db-migration-factory';
import { dbStoreNames } from '../constants/db-store-names';

export const dbConfig: DBConfig = {
  name: 'random-tasks-generator-db',
  version: 1,
  objectStoresMeta: [
    {
      store: dbStoreNames.tag,
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: true } },
        { name: 'description', keypath: 'description', options: { unique: false } }
      ]
    }
  ],
  migrationFactory: dbMigrationFactory
};

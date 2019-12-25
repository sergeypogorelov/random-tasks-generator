import { IDBPDatabase, IDBPTransaction } from 'idb';

import { dbStoreNames } from '../constants/db-store-names';
import { dbIndexNames } from '../constants/db-index-names';

export function dbMigrationFactory() {
  return {
    1: (db: IDBPDatabase, transaction: IDBPTransaction) => {
      let store = transaction.objectStore(dbStoreNames.tag);
      store.createIndex(dbIndexNames.tag.name, 'name', { unique: true });

      store = transaction.objectStore(dbStoreNames.subTasks);
      store.createIndex(dbIndexNames.subTasks.name, 'name', { unique: true });
      store.createIndex(dbIndexNames.subTasks.tagIds, 'tagIds', { unique: false, multiEntry: true });
    }
  };
}

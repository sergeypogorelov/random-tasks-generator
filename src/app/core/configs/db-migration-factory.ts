import { dbStoreNames } from '../constants/db-store-names';
import { dbIndexNames } from '../constants/db-index-names';

export function dbMigrationFactory() {
  return {
    1: (db: IDBDatabase, transaction: IDBTransaction) => {
      let store = transaction.objectStore(dbStoreNames.tag);
      store.createIndex(dbIndexNames.tag.name, 'name', { unique: true });

      store = transaction.objectStore(dbStoreNames.subTasks);
      store.createIndex(dbIndexNames.subTasks.name, 'name', { unique: true });
    }
  };
}

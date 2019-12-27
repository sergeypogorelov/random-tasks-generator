import { IDBPDatabase, IDBPTransaction } from 'idb';

export function dbMigrationFactory() {
  return {
    1: (db: IDBPDatabase, transaction: IDBPTransaction) => {
      const tagStore = db.createObjectStore('tag', { keyPath: 'id', autoIncrement: true });
      tagStore.createIndex('nameIdx', 'name', { unique: true });

      const subtaskStore = db.createObjectStore('subtask', { keyPath: 'id', autoIncrement: true });
      subtaskStore.createIndex('nameIdx', 'name', { unique: true });
      subtaskStore.createIndex('tagIdsIdx', 'tagIds', { unique: false, multiEntry: true });
    },
    2: (db: IDBPDatabase, transaction: IDBPTransaction) => {
      const taskStore = db.createObjectStore('task', { keyPath: 'id', autoIncrement: true });
      taskStore.createIndex('nameIdx', 'name', { unique: true });
      taskStore.createIndex('tagIdsIdx', 'tagIds', { unique: false, multiEntry: true });
    }
  };
}

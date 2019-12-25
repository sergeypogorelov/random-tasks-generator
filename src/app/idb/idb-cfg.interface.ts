import { IDBPDatabase, IDBPTransaction } from 'idb';

export interface IdbCfg {
  name: string;
  version: number;
  migrationFactory: () => { [key: number]: (db: IDBPDatabase, transaction: IDBPTransaction) => void };
}

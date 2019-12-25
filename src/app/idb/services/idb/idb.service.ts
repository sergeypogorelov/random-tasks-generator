import { Injectable, Inject } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { share, tap, mergeMap } from 'rxjs/operators';
import { IDBPDatabase, openDB, OpenDBCallbacks, unwrap, IDBPTransaction } from 'idb';

import { IdbCfg } from '../../idb-cfg.interface';
import { idbCfgToken } from './idb-cfg-token';

@Injectable()
export class IdbService {
  private db: IDBPDatabase<any>;

  private dbObservable: Observable<IDBPDatabase<any>>;

  constructor(@Inject(idbCfgToken) private idbCfg: IdbCfg) {}

  openDB<T>(): Observable<IDBPDatabase<T>> {
    if (this.db) {
      return of(this.db);
    }

    if (this.dbObservable) {
      return this.dbObservable;
    }

    this.dbObservable = from(openDB<T>(this.idbCfg.name, this.idbCfg.version, this.getOpenDBCallbacks()))
      .pipe(share())
      .pipe(tap(db => (this.db = db)));

    return this.dbObservable;
  }

  private getOpenDBCallbacks<T>(): OpenDBCallbacks<T> {
    return {
      upgrade: (database, oldVersion, newVersion, transaction) => {
        const migrations = this.idbCfg.migrationFactory();

        const versions = Object.keys(migrations)
          .map(i => +i)
          .filter(i => i)
          .sort((a: number, b: number) => b - a);

        if (versions.length === 0) {
          return;
        }

        let oldIndex = versions.indexOf(oldVersion);
        const newIndex = versions.indexOf(newVersion);

        if (oldIndex === -1) {
          oldIndex = 0;
        }

        for (let i = oldIndex; i <= newIndex; i++) {
          migrations[versions[i]](database as any, transaction as any);
        }
      }
    };
  }
}

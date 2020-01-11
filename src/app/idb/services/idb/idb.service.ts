import { Injectable, Inject } from '@angular/core';
import { Observable, of, from, Subject } from 'rxjs';
import { share, tap, finalize } from 'rxjs/operators';
import { IDBPDatabase, openDB, OpenDBCallbacks } from 'idb';

import { IdbCfg } from '../../idb-cfg.interface';
import { idbCfgToken } from './idb-cfg-token';

@Injectable()
export class IdbService {
  get requestStarts(): Observable<any> {
    return this.requestStartSubject.asObservable();
  }

  get requestEnds(): Observable<any> {
    return this.requestEndSubject.asObservable();
  }

  private requestStartSubject = new Subject<any>();

  private requestEndSubject = new Subject<any>();

  private db: IDBPDatabase<any>;

  private dbObservable: Observable<IDBPDatabase<any>>;

  constructor(@Inject(idbCfgToken) private idbCfg: IdbCfg) {}

  openDB<T>(): Observable<IDBPDatabase<T>> {
    this.requestStartSubject.next();

    if (this.db) {
      return this.extendDbObservable(of(this.db));
    }

    if (this.dbObservable) {
      return this.dbObservable;
    }

    this.dbObservable = from(openDB<T>(this.idbCfg.name, this.idbCfg.version, this.getOpenDBCallbacks()))
      .pipe(share())
      .pipe(tap(db => (this.db = db)));

    this.dbObservable = this.extendDbObservable(this.dbObservable);

    return this.dbObservable;
  }

  private getOpenDBCallbacks<T>(): OpenDBCallbacks<T> {
    return {
      upgrade: (database, oldVersion, newVersion, transaction) => {
        const migrations = this.idbCfg.migrationFactory();

        const versions = Object.keys(migrations)
          .map(i => +i)
          .filter(i => i)
          .sort((a: number, b: number) => a - b);

        if (versions.length === 0) {
          return;
        }

        const oldIndex = versions.indexOf(oldVersion);
        const newIndex = versions.indexOf(newVersion);

        for (let i = oldIndex + 1; i <= newIndex; i++) {
          migrations[versions[i]](database as any, transaction as any);
        }
      }
    };
  }

  private extendDbObservable(dbObservable: Observable<IDBPDatabase<any>>): Observable<IDBPDatabase<any>> {
    if (!dbObservable) {
      throw new Error('Database observable is not specified.');
    }

    return dbObservable.pipe(finalize(() => this.requestEndSubject.next()));
  }
}

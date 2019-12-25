import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IdbService } from '../../../idb/services/idb/idb.service';

@Injectable()
export class DatabaseService {
  protected currentStoreName: string;

  constructor(private idbService: IdbService) {}

  protected getAll<T>(query?: any, count?: number): Observable<T[]> {
    return this.idbService.openDB().pipe(mergeMap(db => db.getAll(this.currentStoreName, query, count)));
  }

  protected getById<T>(query: any): Observable<T> {
    return this.idbService.openDB().pipe(mergeMap(db => db.get(this.currentStoreName, query)));
  }

  protected getByIndex(indexName: string, query: any): Observable<any> {
    return this.idbService.openDB().pipe(mergeMap(db => db.getFromIndex(this.currentStoreName, indexName, query)));
  }

  protected add<T, R>(value: T, key?: any): Observable<R> {
    return this.idbService
      .openDB()
      .pipe(mergeMap(db => db.add(this.currentStoreName, value, key)))
      .pipe(mergeMap(id => this.getById<R>(id as any)));
  }

  protected update<T>(value: T, key?: any): Observable<any> {
    return this.idbService.openDB().pipe(mergeMap(db => db.put(this.currentStoreName, value, key)));
  }

  protected delete(key: any): Observable<any> {
    return this.idbService.openDB().pipe(mergeMap(db => db.delete(this.currentStoreName, key)));
  }
}

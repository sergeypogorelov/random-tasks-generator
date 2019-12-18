import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class DatabaseService {
  protected currentStoreName: string;

  constructor(private dbService: NgxIndexedDBService) {}

  protected getAll<T>(): Observable<T[]> {
    this.setCurrentStoreName();

    return from(this.dbService.getAll<T>());
  }

  protected getById<T>(id: string | number): Observable<T> {
    this.setCurrentStoreName();

    return from(this.dbService.getByID<T>(id));
  }

  protected getByIndex(indexName: string, key: any): Observable<any> {
    this.setCurrentStoreName();

    return from(this.dbService.getByIndex(indexName, key));
  }

  protected getByKey(key: any): Observable<any> {
    this.setCurrentStoreName();

    return from(this.dbService.getByKey(key));
  }

  protected add<T, R>(value: T, key?: any): Observable<R> {
    this.setCurrentStoreName();

    return from(this.dbService.add(value, key)).pipe(mergeMap(id => this.getById<R>(id)));
  }

  protected update<T>(value: T, key?: any): Observable<any> {
    this.setCurrentStoreName();

    return from(this.dbService.update(value, key));
  }

  protected delete(id: string | number): Observable<any> {
    this.setCurrentStoreName();

    return from(this.dbService.deleteRecord(id));
  }

  protected setCurrentStoreName() {
    this.dbService.currentStore = this.currentStoreName;
  }
}

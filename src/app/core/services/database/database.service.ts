import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, from } from 'rxjs';

@Injectable()
export class DatabaseService {
  get currentStore(): string {
    return this.dbService.currentStore;
  }

  set currentStore(value: string) {
    if (!value) {
      throw new Error('Current store is not specified.');
    }

    this.dbService.currentStore = value;
  }

  constructor(private dbService: NgxIndexedDBService) {}

  getAll<T>(): Observable<T[]> {
    return from(this.dbService.getAll<T>());
  }

  getByKey<T>(key: any): Observable<T> {
    return from(this.dbService.getByKey(key));
  }

  getByIndex<T>(indexName: string, key: any): Observable<T> {
    return from(this.dbService.getByIndex(indexName, key));
  }

  add<T>(value: T, key?: any): Observable<number> {
    return from(this.dbService.add(value, key));
  }
}

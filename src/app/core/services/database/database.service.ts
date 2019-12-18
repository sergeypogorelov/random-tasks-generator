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

  getById<T>(id: string | number): Observable<T> {
    return from(this.dbService.getByID<T>(id));
  }

  getByIndex<T>(indexName: string, key: any): Observable<T> {
    return from(this.dbService.getByIndex(indexName, key));
  }

  add<T>(value: T, key?: any): Observable<number> {
    return from(this.dbService.add(value, key));
  }

  update<T>(value: T, key?: any): Observable<any> {
    return from(this.dbService.update(value, key));
  }

  delete(id: string | number): Observable<any> {
    return from(this.dbService.deleteRecord(id));
  }
}

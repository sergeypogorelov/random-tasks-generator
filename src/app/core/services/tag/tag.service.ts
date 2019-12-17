import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { dbStoreNames } from '../../constants/db-store-names';
import { dbIndexNames } from '../../constants/db-index-names';

import { TagShort } from '../../interfaces/tag/tag-short.interface';
import { Tag } from '../../interfaces/tag/tag.interface';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class TagService {
  constructor(private dbService: DatabaseService) {
    this.setStoreName();
  }

  checkIfNameUnused(name: string): Observable<boolean> {
    return this.getByName(name).pipe(map(tag => !tag));
  }

  getByName(name: string): Observable<Tag> {
    return this.dbService.getByIndex<Tag>(dbIndexNames.tag.name, name);
  }

  getAll(): Observable<Tag[]> {
    return this.dbService.getAll<Tag>();
  }

  add(tagShort: TagShort): Observable<number> {
    return this.dbService.add(tagShort);
  }

  setStoreName() {
    this.dbService.currentStore = dbStoreNames.tag;
  }
}

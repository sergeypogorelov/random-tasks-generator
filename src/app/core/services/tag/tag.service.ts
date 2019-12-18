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

  checkIfNameUnused(name: string, originName: string = null): Observable<boolean> {
    return this.getByName(name).pipe(map(tag => (tag ? tag.name === originName : true)));
  }

  getById(id: number): Observable<Tag> {
    return this.dbService.getById(id);
  }

  getByName(name: string): Observable<Tag> {
    return this.dbService.getByIndex<Tag>(dbIndexNames.tag.name, name);
  }

  getAll(): Observable<Tag[]> {
    return this.dbService.getAll<Tag>();
  }

  add(tagShort: TagShort): Observable<number> {
    if (!tagShort) {
      throw new Error('Tag short is not specified.');
    }

    return this.dbService.add(tagShort);
  }

  update(tag: Tag): Observable<any> {
    if (!tag) {
      throw new Error('Tag is not specified.');
    }

    return this.dbService.update(tag);
  }

  delete(id: number): Observable<any> {
    if (!id) {
      throw new Error('Id is not specified.');
    }

    return this.dbService.delete(id);
  }

  setStoreName() {
    this.dbService.currentStore = dbStoreNames.tag;
  }
}

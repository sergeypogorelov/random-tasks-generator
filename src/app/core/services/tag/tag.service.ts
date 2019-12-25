import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { dbStoreNames } from '../../constants/db-store-names';
import { dbIndexNames } from '../../constants/db-index-names';

import { TagShort } from '../../interfaces/tag/tag-short.interface';
import { Tag } from '../../interfaces/tag/tag.interface';

import { IdbService } from '../../../idb/services/idb/idb.service';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TagService extends DatabaseService {
  constructor(idbService: IdbService) {
    super(idbService);

    this.currentStoreName = dbStoreNames.tag;
  }

  checkIfNameUnused(name: string, originName: string = null): Observable<boolean> {
    if (!name) {
      throw new Error('Name is not specified.');
    }

    return this.getTagByName(name).pipe(map(tag => (tag ? tag.name === originName : true)));
  }

  getTagById(id: number): Observable<Tag> {
    if (!id) {
      throw new Error('Id is not specified.');
    }

    return this.getById(id);
  }

  getTagByName(name: string): Observable<Tag> {
    if (!name) {
      throw new Error('Name is not specified.');
    }

    return this.getByIndex(dbIndexNames.tag.name, name);
  }

  getAllTags(): Observable<Tag[]> {
    return this.getAll<Tag>();
  }

  addTag(tagShort: TagShort): Observable<Tag> {
    if (!tagShort) {
      throw new Error('Tag short is not specified.');
    }

    return this.add(tagShort);
  }

  updateTag(tag: Tag): Observable<any> {
    if (!tag) {
      throw new Error('Tag is not specified.');
    }

    return this.update(tag);
  }

  deleteTag(id: number): Observable<any> {
    if (!id) {
      throw new Error('Id is not specified.');
    }

    return this.delete(id);
  }
}

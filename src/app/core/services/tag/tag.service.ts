import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { dbStoreNames } from '../../constants/db-store-names';

import { TagShort } from '../../interfaces/tag/tag-short.interface';
import { Tag } from '../../interfaces/tag/tag.interface';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class TagService {
  constructor(private dbService: DatabaseService) {
    this.setStoreName();
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

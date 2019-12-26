import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { RtgDbSchema } from '../../interfaces/rtg-db-schema.interface';
import { Tag } from '../../interfaces/tag/tag.interface';

import { IdbService } from '../../../idb/services/idb/idb.service';

@Injectable()
export class TagService {
  constructor(private idbService: IdbService) {}

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

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.get('tag', id)));
  }

  getTagByName(name: string): Observable<Tag> {
    if (!name) {
      throw new Error('Name is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.getFromIndex('tag', 'nameIdx', name)));
  }

  getAllTags(): Observable<Tag[]> {
    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.getAll('tag')));
  }

  addTag(tag: Tag): Observable<Tag> {
    if (!tag) {
      throw new Error('Tag is not specified.');
    }

    return this.idbService
      .openDB<RtgDbSchema>()
      .pipe(mergeMap(db => db.add('tag', tag)))
      .pipe(mergeMap(id => this.getTagById(id)));
  }

  updateTag(tag: Tag): Observable<Tag> {
    if (!tag) {
      throw new Error('Tag is not specified.');
    }

    return this.idbService
      .openDB<RtgDbSchema>()
      .pipe(mergeMap(db => db.put('tag', tag)))
      .pipe(mergeMap(id => this.getTagById(id)));
  }

  deleteTag(id: number): Observable<any> {
    if (!id) {
      throw new Error('Id is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.delete('tag', id)));
  }
}

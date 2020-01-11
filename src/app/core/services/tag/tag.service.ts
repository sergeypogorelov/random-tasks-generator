import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { RtgDbSchema } from '../../interfaces/rtg-db-schema.interface';
import { Tag } from '../../interfaces/tag/tag.interface';
import { NameUnusedService } from '../../validators/name-unused/name-unused-service.interface';

import { IdbService } from '../../../idb/services/idb/idb.service';
import { TaskService } from '../task/task.service';
import { SubtaskService } from '../subtask/subtask.service';

@Injectable()
export class TagService implements NameUnusedService {
  constructor(
    private idbService: IdbService,
    private taskService: TaskService,
    private subtaskService: SubtaskService
  ) {}

  checkIfNameUnused(name: string, originName: string = null): Observable<boolean> {
    if (!name) {
      throw new Error('Name is not specified.');
    }

    return this.getTagByName(name).pipe(map(tag => (tag ? tag.name === originName : true)));
  }

  checkIfTagIdsUnused(tagIds: number[]): Observable<boolean> {
    return forkJoin(this.taskService.getIdsByTagIds(tagIds), this.subtaskService.getIdsByTagIds(tagIds)).pipe(
      map(results => results[0].length === 0 && results[1].length === 0)
    );
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

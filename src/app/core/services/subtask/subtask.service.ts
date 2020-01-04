import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { IDBPDatabase } from 'idb';

import { RtgDbSchema } from '../../interfaces/rtg-db-schema.interface';
import { Subtask } from '../../interfaces/subtask/subtask.interface';
import { NameUnusedService } from '../../validators/name-unused/name-unused-service.interface';

import { Utils } from '../../helpers/utils.class';

import { IdbService } from '../../../idb/services/idb/idb.service';

@Injectable()
export class SubtaskService implements NameUnusedService {
  constructor(private idbService: IdbService) {}

  checkIfNameUnused(name: string, originName: string = null): Observable<boolean> {
    if (!name) {
      throw new Error('Name is not specified.');
    }

    return this.getSubtaskByName(name).pipe(map(subtask => (subtask ? subtask.name === originName : true)));
  }

  getSubtaskById(id: number): Observable<Subtask> {
    if (!id) {
      throw new Error('Id is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.get('subtask', id)));
  }

  getByIds(ids: number[]): Observable<Subtask[]> {
    if (!ids) {
      throw new Error('Ids are not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => this.getAllByIds(db, ids)));
  }

  getSubtaskByName(name: string): Observable<Subtask> {
    if (!name) {
      throw new Error('Name is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.getFromIndex('subtask', 'nameIdx', name)));
  }

  getAllSubtasks(): Observable<Subtask[]> {
    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.getAll('subtask')));
  }

  getIdsByTagIds(tagIds: number[]) {
    if (!tagIds) {
      throw new Error('Tag ids are not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => this.getAllIdsByTagIds(db, tagIds)));
  }

  addSubtask(subTask: Subtask): Observable<Subtask> {
    if (!subTask) {
      throw new Error('Subtask is not specified.');
    }

    return this.idbService
      .openDB<RtgDbSchema>()
      .pipe(mergeMap(db => db.add('subtask', subTask)))
      .pipe(mergeMap(id => this.getSubtaskById(id)));
  }

  updateSubtask(subtask: Subtask): Observable<Subtask> {
    if (!subtask) {
      throw new Error('Subtask is not specified.');
    }

    return this.idbService
      .openDB<RtgDbSchema>()
      .pipe(mergeMap(db => db.put('subtask', subtask)))
      .pipe(mergeMap(id => this.getSubtaskById(id)));
  }

  deleteSubtask(id: number): Observable<any> {
    if (!id) {
      throw new Error('Id is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.delete('subtask', id)));
  }

  private async getAllByIds(db: IDBPDatabase<RtgDbSchema>, ids: number[]): Promise<Subtask[]> {
    if (!db) {
      throw new Error('IDBPDatabase instance is not specified.');
    }

    if (!ids) {
      throw new Error('Ids are not specified.');
    }

    ids = ids.sort((a, b) => a - b);

    const results: Subtask[] = [];

    let i = 0;
    let cursor = await db.transaction('subtask').store.openCursor();

    while (cursor) {
      if (cursor.key === ids[i]) {
        results.push(cursor.value);
        i++;
      }

      if (i >= ids.length) {
        break;
      }

      cursor = await cursor.continue(ids[i]);
    }

    return results;
  }

  private async getAllIdsByTagIds(db: IDBPDatabase<RtgDbSchema>, tagIds: number[]): Promise<number[]> {
    if (!db) {
      throw new Error('IDBPDatabase instance is not specified.');
    }

    if (!tagIds) {
      throw new Error('Tag ids are not specified.');
    }

    const results: number[] = [];

    for (const tagId of tagIds) {
      const subtaskIds = await db.getAllKeysFromIndex('subtask', 'tagIdsIdx', IDBKeyRange.only(tagId));

      results.push(...subtaskIds);
    }

    return Utils.arrayDistinct(results);
  }
}

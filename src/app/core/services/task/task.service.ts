import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { IDBPDatabase } from 'idb';

import { RtgDbSchema } from '../../interfaces/rtg-db-schema.interface';
import { Task } from '../../interfaces/task/task.interface';
import { NameUnusedService } from '../../validators/name-unused/name-unused-service.interface';

import { Utils } from '../../helpers/utils.class';

import { IdbService } from '../../../idb/services/idb/idb.service';

@Injectable()
export class TaskService implements NameUnusedService {
  constructor(private idbService: IdbService) {}

  checkIfNameUnused(name: string, originName: string = null): Observable<boolean> {
    if (!name) {
      throw new Error('Name is not specified.');
    }

    return this.getByName(name).pipe(map(task => (task ? task.name === originName : true)));
  }

  checkIfIdUnused(id: number): Observable<boolean> {
    if (!id) {
      throw new Error('Id is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => this.checkIfSubtaskIdUnused(db, id)));
  }

  getById(id: number): Observable<Task> {
    if (!id) {
      throw new Error('Id is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.get('task', id)));
  }

  getByIds(ids: number[]): Observable<Task[]> {
    if (!ids) {
      throw new Error('Ids are not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => this.getAllByIds(db, ids)));
  }

  getByName(name: string): Observable<Task> {
    if (!name) {
      throw new Error('Name is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.getFromIndex('task', 'nameIdx', name)));
  }

  getAll(): Observable<Task[]> {
    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.getAll('task')));
  }

  getIdsByTagIds(tagIds: number[]) {
    if (!tagIds) {
      throw new Error('Tag ids are not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => this.getAllIdsByTagIds(db, tagIds)));
  }

  add(task: Task): Observable<Task> {
    if (!task) {
      throw new Error('Task is not specified.');
    }

    return this.idbService
      .openDB<RtgDbSchema>()
      .pipe(mergeMap(db => db.add('task', task)))
      .pipe(mergeMap(id => this.getById(id)));
  }

  update(task: Task): Observable<Task> {
    if (!task) {
      throw new Error('Task is not specified.');
    }

    return this.idbService
      .openDB<RtgDbSchema>()
      .pipe(mergeMap(db => db.put('task', task)))
      .pipe(mergeMap(id => this.getById(id)));
  }

  delete(id: number): Observable<any> {
    if (!id) {
      throw new Error('Id is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.delete('task', id)));
  }

  private async checkIfSubtaskIdUnused(db: IDBPDatabase<RtgDbSchema>, id: number): Promise<boolean> {
    if (!db) {
      throw new Error('IDBPDatabase instance is not specified.');
    }

    if (!id) {
      throw new Error('Id is not specified.');
    }

    let result = true;
    let cursor = await db.transaction('person').store.openCursor();

    while (cursor) {
      const taskIdsNotFlat = cursor.value.iterations.map(iteration => iteration.tasks.map(task => task.taskId));
      const taskIds = Utils.arrayFlat(taskIdsNotFlat);

      if (taskIds.includes(id)) {
        result = false;
        break;
      }

      cursor = await cursor.continue();
    }

    return result;
  }

  private async getAllByIds(db: IDBPDatabase<RtgDbSchema>, ids: number[]): Promise<Task[]> {
    if (!db) {
      throw new Error('IDBPDatabase instance is not specified.');
    }

    if (!ids) {
      throw new Error('Ids are not specified.');
    }

    ids = ids.sort((a, b) => a - b);

    const results: Task[] = [];

    let i = 0;
    let cursor = await db.transaction('task').store.openCursor();

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
      const subtaskIds = await db.getAllKeysFromIndex('task', 'tagIdsIdx', IDBKeyRange.only(tagId));

      results.push(...subtaskIds);
    }

    return Utils.arrayDistinct(results);
  }
}

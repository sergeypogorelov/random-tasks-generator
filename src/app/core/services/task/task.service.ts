import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { RtgDbSchema } from '../../interfaces/rtg-db-schema.interface';
import { Task } from '../../interfaces/task/task.interface';
import { NameUnusedService } from '../../validators/name-unused/name-unused-service.interface';

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

  getById(id: number): Observable<Task> {
    if (!id) {
      throw new Error('Id is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.get('task', id)));
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
}

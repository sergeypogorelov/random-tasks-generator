import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxIndexedDBService } from 'ngx-indexed-db';

import { dbStoreNames } from '../../constants/db-store-names';
import { dbIndexNames } from '../../constants/db-index-names';

import { Subtask } from '../../interfaces/subtask/subtask.interface';
import { SubtaskShort } from '../../interfaces/subtask/subtask-short.interface';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class SubtaskService extends DatabaseService {
  constructor(dbService: NgxIndexedDBService) {
    super(dbService);

    this.currentStoreName = dbStoreNames.subTasks;
  }

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

    return this.getById(id);
  }

  getSubtaskByName(name: string): Observable<Subtask> {
    if (!name) {
      throw new Error('Name is not specified.');
    }

    return this.getByIndex(dbIndexNames.subTasks.name, name);
  }

  getAllSubtasks(): Observable<Subtask[]> {
    return this.getAll<Subtask>();
  }

  addSubtask(subTask: SubtaskShort): Observable<Subtask> {
    if (!subTask) {
      throw new Error('Subtask is not specified.');
    }

    return this.add(subTask);
  }

  updateSubtask(subtask: Subtask): Observable<any> {
    if (!subtask) {
      throw new Error('Subtask is not specified.');
    }

    return this.update(subtask);
  }

  deleteSubtask(id: number): Observable<any> {
    if (!id) {
      throw new Error('Id is not specified.');
    }

    return this.delete(id);
  }
}

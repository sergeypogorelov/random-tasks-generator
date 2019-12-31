import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { RtgDbSchema } from '../../interfaces/rtg-db-schema.interface';
import { Subtask } from '../../interfaces/subtask/subtask.interface';
import { NameUnusedService } from '../../validators/name-unused/name-unused-service.interface';

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

  getSubtaskByName(name: string): Observable<Subtask> {
    if (!name) {
      throw new Error('Name is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.getFromIndex('subtask', 'nameIdx', name)));
  }

  getAllSubtasks(): Observable<Subtask[]> {
    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.getAll('subtask')));
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
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { RtgDbSchema } from '../../interfaces/rtg-db-schema.interface';
import { Task } from '../../interfaces/task/task.interface';

import { IdbService } from '../../../idb/services/idb/idb.service';

@Injectable()
export class TaskService {
  constructor(private idbService: IdbService) {}

  checkIfNameUnused(name: string, originName: string = null): Observable<boolean> {
    if (!name) {
      throw new Error('Name is not specified.');
    }

    return this.getByName(name).pipe(map(task => (task ? task.name === originName : true)));
  }

  getByName(name: string): Observable<Task> {
    if (!name) {
      throw new Error('Name is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.getFromIndex('task', 'nameIdx', name)));
  }
}

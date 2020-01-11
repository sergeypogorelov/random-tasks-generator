import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { NameUnusedService } from '../../../core/validators/name-unused/name-unused-service.interface';
import { RtgDbSchema } from '../../interfaces/rtg-db-schema.interface';
import { Person } from '../../interfaces/person/person.interface';

import { IdbService } from '../../../idb/services/idb/idb.service';
import { GameResultService } from '../game-result/game-result.service';

@Injectable()
export class PersonService implements NameUnusedService {
  constructor(private idbService: IdbService, private gameResultService: GameResultService) {}

  checkIfNameUnused(name: string, originName: string = null): Observable<boolean> {
    if (!name) {
      throw new Error('Name is not specified.');
    }

    return this.getByName(name).pipe(map(person => (person ? person.name === originName : true)));
  }

  checkIfIdUnused(id: number): Observable<boolean> {
    if (!id) {
      throw new Error('Id is not specified.');
    }

    return this.gameResultService.getAllByPersonId(id).pipe(map(gameResults => gameResults.length === 0));
  }

  getById(id: number): Observable<Person> {
    if (!id) {
      throw new Error('Id is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.get('person', id)));
  }

  getByName(name: string): Observable<Person> {
    if (!name) {
      throw new Error('Name is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.getFromIndex('person', 'nameIdx', name)));
  }

  getAll(): Observable<Person[]> {
    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.getAll('person')));
  }

  add(person: Person): Observable<Person> {
    if (!person) {
      throw new Error('Person is not specified.');
    }

    return this.idbService
      .openDB<RtgDbSchema>()
      .pipe(mergeMap(db => db.add('person', person)))
      .pipe(mergeMap(id => this.getById(id)));
  }

  update(person: Person): Observable<Person> {
    if (!person) {
      throw new Error('Person is not specified.');
    }

    return this.idbService
      .openDB<RtgDbSchema>()
      .pipe(mergeMap(db => db.put('person', person)))
      .pipe(mergeMap(id => this.getById(id)));
  }

  delete(id: number): Observable<any> {
    if (!id) {
      throw new Error('Id is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.delete('person', id)));
  }
}

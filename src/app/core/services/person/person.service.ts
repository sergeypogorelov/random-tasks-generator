import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { NameUnusedService } from '../../../shared/validators/name-unused/name-unused-service.interface';
import { RtgDbSchema } from '../../interfaces/rtg-db-schema.interface';
import { Person } from '../../interfaces/person/person.interface';

import { IdbService } from '../../../idb/services/idb/idb.service';

@Injectable()
export class PersonService implements NameUnusedService {
  constructor(private idbService: IdbService) {}

  checkIfNameUnused(name: string, originName: string = null): Observable<boolean> {
    if (!name) {
      throw new Error('Name is not specified.');
    }

    return this.getByName(name).pipe(map(person => (person ? person.name === originName : true)));
  }

  getById(id: number): Observable<Person> {
    if (!id) {
      throw new Error('Id is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.get('peson', id)));
  }

  getByName(name: string): Observable<Person> {
    if (!name) {
      throw new Error('Name is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.getFromIndex('peson', 'nameIdx', name)));
  }

  getAll(): Observable<Person[]> {
    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.getAll('peson')));
  }

  add(person: Person): Observable<Person> {
    if (!person) {
      throw new Error('Person is not specified.');
    }

    return this.idbService
      .openDB<RtgDbSchema>()
      .pipe(mergeMap(db => db.add('peson', person)))
      .pipe(mergeMap(id => this.getById(id)));
  }

  update(person: Person): Observable<Person> {
    if (!person) {
      throw new Error('Person is not specified.');
    }

    return this.idbService
      .openDB<RtgDbSchema>()
      .pipe(mergeMap(db => db.put('peson', person)))
      .pipe(mergeMap(id => this.getById(id)));
  }

  delete(id: number): Observable<any> {
    if (!id) {
      throw new Error('Id is not specified.');
    }

    return this.idbService.openDB<RtgDbSchema>().pipe(mergeMap(db => db.delete('peson', id)));
  }
}

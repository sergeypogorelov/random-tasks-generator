import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { urlFragments } from '../core/constants/url-fragments';

import { GameTask } from './game-task.interface';

import { GameStateService } from './game-state.service';
import { Person } from '../core/interfaces/person/person.interface';
import { Task } from '../core/interfaces/task/task.interface';

@Injectable()
export class GameService {
  private currentPerson: Person;

  private tasks: Task[];

  constructor(private gameStateService: GameStateService) {}

  getCurrentPerson(): Person {
    return this.currentPerson;
  }

  setCurrentPerson(person: Person) {
    if (!person) {
      throw new Error('Person is not specified.');
    }

    this.currentPerson = person;
  }
}

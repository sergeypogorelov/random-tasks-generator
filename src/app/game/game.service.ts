import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { urlFragments } from '../core/constants/url-fragments';

import { GameTask } from './game-task.interface';

import { GameStateService } from './game-state.service';
import { Person } from '../core/interfaces/person/person.interface';
import { Task } from '../core/interfaces/task/task.interface';
import { PersonIteration } from '../core/interfaces/person/person-iteration.interface';
import { RandHelper } from '../core/helpers/rand-helper.class';

const DAY_MULTIPLIER = 24 * 60 * 60 * 1000;

@Injectable()
export class GameService {
  private currentPerson: Person;

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

  determineCurrentPersonIteration(): PersonIteration {
    if (!this.currentPerson) {
      throw new Error('Current person is not specified.');
    }

    const startDateTimestamp = new Date(this.currentPerson.startDate).getTime();
    const currentTimestamp = new Date().getTime();

    const iterations = this.currentPerson.iterations;

    let timePassed = currentTimestamp - startDateTimestamp;
    if (timePassed < 0) {
      throw new Error('Start date is later than now.');
    }

    let i = 0;
    while (true) {
      const iterationTimePassed = iterations[i].duration * DAY_MULTIPLIER;

      timePassed -= iterationTimePassed;

      if (timePassed < 0) {
        break;
      }

      if (i === iterations.length - 1) {
        i = 0;
      } else {
        i++;
      }
    }

    return iterations[i];
  }

  getGameTasks(generateIfUndefined = true): GameTask[] {
    if (!this.currentPerson) {
      throw new Error('Current person is not specified.');
    }

    const gameTasks = this.gameStateService.getState(this.currentPerson.id).tasks;
    if (gameTasks.length > 0 || !generateIfUndefined) {
      return gameTasks;
    }

    const newGameTasks: GameTask[] = [];
    const personIteration = this.determineCurrentPersonIteration();

    for (const personTask of personIteration.tasks) {
      if (RandHelper.getTrueOrFalse(personTask.probability)) {
        newGameTasks.push({
          taskId: personTask.taskId,
          subtaskIds: []
        });
      }
    }

    return newGameTasks;
  }
}

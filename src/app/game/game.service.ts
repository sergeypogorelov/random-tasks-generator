import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { urlFragments } from '../core/constants/url-fragments';

import { GameTask } from './game-task.interface';

import { GameStateService } from './game-state.service';
import { Person } from '../core/interfaces/person/person.interface';
import { Task } from '../core/interfaces/task/task.interface';
import { PersonIteration } from '../core/interfaces/person/person-iteration.interface';
import { RandHelper } from '../core/helpers/rand-helper.class';
import { Observable, of, forkJoin } from 'rxjs';
import { Subtask } from '../core/interfaces/subtask/subtask.interface';
import { SubtaskService } from '../core/services/subtask/subtask.service';
import { mergeMap, tap } from 'rxjs/operators';
import { ProbabilityRange } from '../core/enums/probability-range.enum';
import { Utils } from '../core/helpers/utils.class';
import { TaskService } from '../core/services/task/task.service';

const DAY_MULTIPLIER = 24 * 60 * 60 * 1000;

@Injectable()
export class GameService {
  private currentPerson: Person;

  constructor(
    private taskService: TaskService,
    private subtaskService: SubtaskService,
    private gameStateService: GameStateService
  ) {}

  getCurrentPerson(): Person {
    return this.currentPerson;
  }

  setCurrentPerson(person: Person) {
    if (!person) {
      throw new Error('Person is not specified.');
    }

    this.currentPerson = person;
  }

  getCurrentPersonIteration(extractIfNull = true): PersonIteration {
    if (!this.currentPerson) {
      throw new Error('Current person is not specified.');
    }

    const { personIteration } = this.gameStateService.getState(this.currentPerson.id);
    if (personIteration || !extractIfNull) {
      return personIteration;
    }

    const startDateTimestamp = new Date(this.currentPerson.startDate).getTime();
    const currentTimestamp = new Date().getTime();

    const iterations = this.currentPerson.iterations;

    let timePassed = currentTimestamp - startDateTimestamp;
    if (timePassed < 0) {
      return null;
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

    this.gameStateService.patchState(this.currentPerson.id, { personIteration: iterations[i] });

    return iterations[i];
  }

  getGameTasks(generateIfEmpty = true): GameTask[] {
    if (!this.currentPerson) {
      throw new Error('Current person is not specified.');
    }

    const gameTasks = this.gameStateService.getState(this.currentPerson.id).tasks;
    if (gameTasks.length > 0 || !generateIfEmpty) {
      return gameTasks;
    }

    const newGameTasks: GameTask[] = [];
    const personIteration = this.getCurrentPersonIteration();

    for (const personTask of personIteration.tasks) {
      if (RandHelper.getTrueOrFalse(personTask.probability)) {
        newGameTasks.push({
          taskId: personTask.taskId,
          subtaskIds: []
        });
      }
    }

    this.gameStateService.patchState(this.currentPerson.id, { tasks: newGameTasks });

    return newGameTasks;
  }

  generateSubtask(gameTaskIndex: number): Observable<Subtask> {
    if (typeof gameTaskIndex !== 'number') {
      throw new Error('Game task index is not specified.');
    }

    if (!this.currentPerson) {
      throw new Error('Current person is not specified.');
    }

    const gameTasks = this.gameStateService.getState(this.currentPerson.id).tasks;
    const gameTask = gameTasks[gameTaskIndex];
    if (!gameTask) {
      throw new Error('Game task cannot be found.');
    }

    const personIteration = this.getCurrentPersonIteration(false);
    if (!personIteration) {
      throw new Error('Person iteration is not specified.');
    }

    const personTask = personIteration.tasks.find(i => i.taskId === gameTask.taskId);
    if (!personTask) {
      return of(null);
    }

    const filteredPersonTags = personTask.tags.filter(i => i.selected);
    if (filteredPersonTags.length === 0) {
      return of(null);
    }

    const tagIds = filteredPersonTags.map(i => i.tagId);

    return forkJoin([
      this.taskService.getById(gameTask.taskId),
      this.subtaskService
        .getIdsByTagIds(tagIds)
        .pipe(
          mergeMap(subtakIds => this.subtaskService.getByIds(subtakIds.filter(id => !gameTask.subtaskIds.includes(id))))
        )
    ]).pipe(
      mergeMap(results => {
        const taskDto = results[0];
        const subtasks = results[1];

        if (subtasks.length === 0) {
          return of(null);
        }

        if (gameTask.subtaskIds.length > taskDto.maxCount - 1) {
          return of(null);
        }

        const subtaskIds: number[] = [];

        for (const personTag of filteredPersonTags) {
          const filteredSubtasks = subtasks.filter(i => i.tagIds.includes(personTag.tagId));

          for (const subtask of filteredSubtasks) {
            let count: number;

            switch (personTag.probability) {
              case ProbabilityRange.Low:
                count = subtask.lowProbabilityScore;
                break;
              case ProbabilityRange.Average:
                count = subtask.averageProbabilityScore;
                break;
              case ProbabilityRange.High:
                count = subtask.highProbabilityScore;
                break;
            }

            for (let i = 0; i < count; i++) {
              subtaskIds.push(subtask.id);
            }
          }
        }

        const shuffledSubtaskids = RandHelper.arrayShuffle(subtaskIds);
        const middleIndex = Math.floor(shuffledSubtaskids.length / 2);
        const generatedSubtaskId = shuffledSubtaskids[middleIndex];

        const result = subtasks.find(i => i.id === generatedSubtaskId) || null;

        if (result) {
          const newGameTasks = Utils.jsonCopy(this.gameStateService.getState(this.currentPerson.id).tasks);
          const newGameTask = Utils.jsonCopy(newGameTasks[gameTaskIndex]);

          newGameTask.subtaskIds.push(result.id);

          newGameTasks[gameTaskIndex] = newGameTask;

          this.gameStateService.patchState(this.currentPerson.id, { tasks: newGameTasks });
        }

        return of(result);
      })
    );
  }
}

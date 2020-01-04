import { Injectable } from '@angular/core';

import { GameState } from './game-state.interface';

import { Utils } from '../core/helpers/utils.class';

@Injectable()
export class GameStateService {
  private statesMap = new Map<number, GameState>();

  getState(personId: number): GameState {
    if (typeof personId !== 'number') {
      throw new Error('Person id is not specified.');
    }

    if (!this.statesMap.has(personId)) {
      this.statesMap.set(personId, this.getDefaultState(personId));
    }

    return this.statesMap.get(personId);
  }

  patchState(personId: number, partialState: GameState) {
    if (typeof personId !== 'number') {
      throw new Error('Person id is not specified.');
    }

    if (!partialState) {
      throw new Error('State is not specified.');
    }

    const state = this.getState(personId);
    const result = {
      ...state,
      ...partialState
    };

    this.setState(personId, result);
  }

  setState(personId: number, newState: GameState) {
    if (typeof personId !== 'number') {
      throw new Error('Person id is not specified.');
    }

    if (!newState) {
      throw new Error('State is not specified.');
    }

    this.statesMap.set(personId, Utils.jsonCopy(newState));
  }

  private getDefaultState(personId: number): GameState {
    if (typeof personId !== 'number') {
      throw new Error('Person id is not specified.');
    }

    return {
      personId,
      personIteration: null,
      tasks: [],
      tasksToDo: [],
      tasksSkipped: [],
      tasksCompleted: [],
      tasksFailed: []
    };
  }
}

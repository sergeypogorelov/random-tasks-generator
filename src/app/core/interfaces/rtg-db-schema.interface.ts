import { DBSchema } from 'idb';

import { Tag } from './tag/tag.interface';
import { Subtask } from './subtask/subtask.interface';
import { Task } from './task/task.interface';
import { Person } from './person/person.interface';
import { GameResult } from './game-result/game-result.interface';

export interface RtgDbSchema extends DBSchema {
  tag: {
    key: number;
    value: Tag;
    indexes: { nameIdx: string };
  };
  subtask: {
    key: number;
    value: Subtask;
    indexes: { nameIdx: string; tagIdsIdx: number[] };
  };
  task: {
    key: number;
    value: Task;
    indexes: { nameIdx: string; tagIdsIdx: number[] };
  };
  person: {
    key: number;
    value: Person;
    indexes: { nameIdx: string };
  };
  'game-result': {
    key: number;
    value: GameResult;
    indexes: { personIdIdx: number; startDateIdx: Date; finishDateIdx: Date };
  };
}

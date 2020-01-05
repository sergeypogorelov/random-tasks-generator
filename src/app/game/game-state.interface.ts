import { PersonIteration } from '../core/interfaces/person/person-iteration.interface';
import { GameTask } from './game-task.interface';
import { GameTaskMarked } from './game-task-marked.interface';

export interface GameState {
  personId?: number;
  personIteration?: PersonIteration;
  tasks?: GameTask[];
  tasksToDo?: GameTask[];
  startDate?: string;
  tasksMarked?: GameTaskMarked[];
  finishDate?: string;
}

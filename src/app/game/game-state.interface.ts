import { PersonIteration } from '../core/interfaces/person/person-iteration.interface';
import { GameTask } from './game-task.interface';

export interface GameState {
  personId?: number;
  personIteration?: PersonIteration;
  tasks?: GameTask[];
  tasksToDo?: GameTask[];
  tasksSkipped?: GameTask[];
  tasksCompleted?: GameTask[];
  tasksFailed?: GameTask[];
}

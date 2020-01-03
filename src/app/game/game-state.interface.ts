import { GameTask } from './game-task.interface';

export interface GameState {
  personId?: number;
  tasks?: GameTask[];
  tasksToDo?: GameTask[];
  tasksSkipped?: GameTask[];
  tasksCompleted?: GameTask[];
}

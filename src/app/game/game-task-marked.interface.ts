import { GameSubtaskMarked } from './game-subtask-marked.interface';

export interface GameTaskMarked {
  id: number;
  taskId: number;
  subtasks: GameSubtaskMarked[];
}

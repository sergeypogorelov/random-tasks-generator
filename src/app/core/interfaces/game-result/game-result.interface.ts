import { GameResultSubtask } from './game-result-subtask.interface';

export interface GameResult {
  id?: number;
  personId: number;
  startDate: Date;
  finishDate: Date;
  subtasks: GameResultSubtask[];
}

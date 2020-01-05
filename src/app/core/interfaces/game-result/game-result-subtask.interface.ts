import { SubtaskStates } from '../../enums/subtask-states.enum';

export interface GameResultSubtask {
  index: number;
  subtaskId: number;
  subtaskState: SubtaskStates;
}

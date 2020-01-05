import { SubtaskStates } from '../core/enums/subtask-states.enum';

export interface GameSubtaskMarked {
  id: number;
  state: SubtaskStates;
}

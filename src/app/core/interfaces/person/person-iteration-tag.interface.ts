import { ProbabilityRange } from '../../enums/probability-range.enum';

export interface PersonIterationTag {
  taskId: number;
  probability: ProbabilityRange;
  selected: boolean;
}

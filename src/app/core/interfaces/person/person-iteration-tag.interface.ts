import { ProbabilityRange } from '../../enums/probability-range.enum';

export interface PersonIterationTag {
  tagId: number;
  probability: ProbabilityRange;
  selected: boolean;
}

import { ProbabilityRange } from 'src/app/core/enums/probability-range.enum';

export interface PersonTagModel {
  id: string;
  name: string;
  probability: ProbabilityRange;
  selected: boolean;
}

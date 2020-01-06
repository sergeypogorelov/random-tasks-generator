import { SafeUrl } from '@angular/platform-browser';

import { SubtaskStates } from '../../../core/enums/subtask-states.enum';

export interface SubtaskModel {
  id: number;
  name: string;
  description: string;
  thumbnailDateUrl: string;
  thumbnailSafeUrl: SafeUrl;
  state: SubtaskStates;
}

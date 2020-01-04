import { SafeUrl } from '@angular/platform-browser';

import { SubtaskModel } from './subtask-model.interface';

export interface TaskModel {
  id: number;
  taskId: number;
  name: string;
  description: string;
  thumbnailDateUrl: string;
  thumbnailSafeUrl: SafeUrl;
  subtasks: SubtaskModel[];
}

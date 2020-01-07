import { SafeUrl } from '@angular/platform-browser';
import { Task } from 'src/app/core/interfaces/task/task.interface';

export interface PersonsGridModel {
  id: number;
  name: string;
  description: string;
  thumbnailDateUrl: string;
  thumbnailSafeUrl: SafeUrl;
  tasks: Task[];
}

import { SafeUrl } from '@angular/platform-browser';

export interface TaskModel {
  id: number;
  name: string;
  description: string;
  thumbnailDateUrl: string;
  thumbnailSafeUrl: SafeUrl;
}

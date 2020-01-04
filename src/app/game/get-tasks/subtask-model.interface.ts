import { SafeUrl } from '@angular/platform-browser';

export interface SubtaskModel {
  id: number;
  name: string;
  description: string;
  thumbnailDateUrl: string;
  thumbnailSafeUrl: SafeUrl;
}

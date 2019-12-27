import { SafeUrl } from '@angular/platform-browser';

import { Tag } from '../../core/interfaces/tag/tag.interface';

export interface TaskModel {
  id: number;
  name: string;
  description: string;
  thumbnailDateUrl: string;
  thumbnailSafeUrl: SafeUrl;
  tags: Tag[];
}

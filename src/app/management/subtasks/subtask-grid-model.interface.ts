import { SafeUrl } from '@angular/platform-browser';

import { Tag } from '../../core/interfaces/tag/tag.interface';

export interface SubtaskGridModel {
  id: number;
  name: string;
  description: string;
  thumbnailDateUrl: string;
  thumbnailSafeUrl: SafeUrl;
  lowProbabilityScore: number;
  averageProbabilityScore: number;
  highProbabilityScore: number;
  tags: Tag[];
}

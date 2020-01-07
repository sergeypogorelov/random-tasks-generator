import { FileInfo } from 'src/app/core/interfaces/common/file-info.interface';
import { Tag } from 'src/app/core/interfaces/tag/tag.interface';

export interface SubtaskModel {
  title: string;
  description: string;
  thumbnail: FileInfo;
  lowProbabilityScore: string;
  averageProbabilityScore: string;
  highProbabilityScore: string;
  tags: Tag[];
}

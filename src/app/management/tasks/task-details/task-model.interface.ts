import { FileInfo } from '../../../core/interfaces/common/file-info.interface';
import { Tag } from '../../../core/interfaces/tag/tag.interface';

export interface TaskModel {
  title: string;
  description: string;
  thumbnail: FileInfo;
  minCount: string;
  maxCount: string;
  tags: Tag[];
}

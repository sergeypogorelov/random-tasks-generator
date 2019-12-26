import { FileInfo } from '../../../core/interfaces/common/file-info.interface';
import { Tag } from '../../../core/interfaces/tag/tag.interface';

export interface TaskDetails {
  title: string;
  description: string;
  thumbnail: FileInfo;
  tags: Tag[];
}

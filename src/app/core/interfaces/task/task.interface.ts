import { FileInfo } from '../common/file-info.interface';

export interface Task {
  id?: number;
  name: string;
  description: string;
  thumbnail: FileInfo;
  tagIds: number[];
}

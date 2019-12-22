import { FileInfo } from '../common/file-info.interface';

export interface Subtask {
  id: number;
  name: string;
  description: string;
  thumbnail: FileInfo;
  lowProbabilityScore: number;
  averageProbabilityScore: number;
  highProbabilityScore: number;
  tagIds: number[];
}

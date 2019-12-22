import { FileInfo } from 'src/app/core/interfaces/common/file-info.interface';

export interface SubtaskDetails {
  title: string;
  description: string;
  thumbnail: FileInfo;
  lowProbabilityScore: string;
  averageProbabilityScore: string;
  highProbabilityScore: string;
  tagNames: string[];
}

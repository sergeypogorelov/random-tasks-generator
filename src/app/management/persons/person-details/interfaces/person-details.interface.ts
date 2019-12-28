import { FileInfo } from 'src/app/core/interfaces/common/file-info.interface';
import { PersonDetailsIteration } from './person-details-iteration.interface';

export interface PersonDetails {
  name: string;
  description: string;
  thumbnail: FileInfo;
  iterations: PersonDetailsIteration[];
}

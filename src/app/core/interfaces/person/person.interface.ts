import { FileInfo } from '../common/file-info.interface';

import { PersonIteration } from './person-iteration.interface';

export interface Person {
  name: string;
  description: string;
  thumbnail: FileInfo;
  startDate: string;
  iterations: PersonIteration[];
}

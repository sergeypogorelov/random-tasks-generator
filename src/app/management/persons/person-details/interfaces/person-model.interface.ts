import { FileInfo } from 'src/app/core/interfaces/common/file-info.interface';
import { PersonIterationModel } from './person-iteration-model.interface';

export interface PersonModel {
  name: string;
  description: string;
  thumbnail: FileInfo;
  startDate: string;
  iterations: PersonIterationModel[];
}

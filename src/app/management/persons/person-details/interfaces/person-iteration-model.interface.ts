import { PersonTaskModel } from './person-task-model.interface';

export interface PersonIterationModel {
  name: string;
  duration: string;
  tasks: PersonTaskModel[];
}

import { PersonIterationTag } from './person-iteration-tag.interface';

export interface PersonIterationTask {
  taskId: number;
  probability: number;
  tags: PersonIterationTag[];
}

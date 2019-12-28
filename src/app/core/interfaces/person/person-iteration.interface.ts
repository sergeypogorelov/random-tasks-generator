import { PersonIterationTask } from './person-iteration-task.interface';

export interface PersonIteration {
  name: string;
  duration: number;
  tasks: PersonIterationTask[];
}

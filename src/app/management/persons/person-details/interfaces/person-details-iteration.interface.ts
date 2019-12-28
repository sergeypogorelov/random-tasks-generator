import { PersonDetailsTask } from './person-details-task.interface';

export interface PersonDetailsIteration {
  name: string;
  duration: string;
  tasks: PersonDetailsTask[];
}

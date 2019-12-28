import { PersonDetailsTag } from './person-details-tag.interface';

export interface PersonDetailsTask {
  id: string;
  probability: string;
  tags: PersonDetailsTag[];
}

import { PersonTagModel } from './person-tag-model.interface';

export interface PersonTaskModel {
  id: string;
  probability: string;
  tags: PersonTagModel[];
}

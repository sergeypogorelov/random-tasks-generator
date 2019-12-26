import { DBSchema } from 'idb';

import { Tag } from './tag/tag.interface';
import { Subtask } from './subtask/subtask.interface';

export interface RtgDbSchema extends DBSchema {
  tag: {
    key: number;
    value: Tag;
    indexes: { nameIdx: string };
  };
  subtask: {
    key: number;
    value: Subtask;
    indexes: { nameIdx: string; tagIdsIdx: number[] };
  };
}

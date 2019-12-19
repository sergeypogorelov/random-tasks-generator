import { LoadMessage } from './load-message.intreface';
import { LoadMessageTypes } from '../load-message-types.enum';

export interface LoadProgressMessage extends LoadMessage {
  type: LoadMessageTypes.Progress;
  loaded: number;
}

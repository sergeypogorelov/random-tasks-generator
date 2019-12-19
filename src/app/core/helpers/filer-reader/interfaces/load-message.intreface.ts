import { LoadMessageTypes } from '../load-message-types.enum';

export interface LoadMessage {
  fileReader: FileReader;
  type: LoadMessageTypes;
}

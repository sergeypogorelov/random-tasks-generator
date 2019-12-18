import { Type } from '@angular/core';

import { ModalComponent } from '../../../shared/components/modal-generator/modal-component.interface';

export interface ModalInfo {
  tag: string;
  component: Type<ModalComponent>;
  componentData?: any;
  callbacksContainer?: any;
}

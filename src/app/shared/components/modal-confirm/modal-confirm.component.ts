import { Component, Input } from '@angular/core';

import { ModalComponent } from '../modal-generator/modal-component.interface';
import { ModalConfirmCallbacksContainer } from './modal-confirm-callbacks-container.interface';

@Component({
  selector: 'rtg-modal-confirm',
  templateUrl: './modal-confirm.component.html'
})
export class ModalConfirmComponent implements ModalComponent {
  @Input()
  callbacksContainer: ModalConfirmCallbacksContainer;

  closeHandler() {
    if (this.callbacksContainer && this.callbacksContainer.close) {
      this.callbacksContainer.close();
    }
  }

  confirmHandler() {
    if (this.callbacksContainer && this.callbacksContainer.confirm) {
      this.callbacksContainer.confirm();
    }
  }
}

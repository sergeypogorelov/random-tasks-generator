import { Component, Input } from '@angular/core';

import { ModalComponent } from '../modal-generator/modal-component.interface';

@Component({
  selector: 'rtg-modal-alert',
  templateUrl: './modal-alert.component.html'
})
export class ModalAlertComponent implements ModalComponent {
  @Input()
  data: { message: string };

  @Input()
  callbacksContainer: { close: () => void };

  closeHandler() {
    if (this.callbacksContainer && this.callbacksContainer.close) {
      this.callbacksContainer.close();
    }
  }
}

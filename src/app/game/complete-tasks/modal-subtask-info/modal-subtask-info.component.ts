import { Component, Input } from '@angular/core';

import { ModalComponent } from '../../../shared/components/modal-generator/modal-component.interface';
import { ModalSubtaskInfoCallbacksContainer } from './modal-subtask-info-callbacks-container.interface';
import { SubtaskModel } from '../subtask-model.interface';

@Component({
  selector: 'rtg-modal-subtask-info',
  templateUrl: './modal-subtask-info.component.html'
})
export class ModalSubtaskInfoComponent implements ModalComponent {
  @Input()
  data: { subtask: SubtaskModel };

  @Input()
  callbacksContainer: ModalSubtaskInfoCallbacksContainer;

  okHandler() {
    if (this.callbacksContainer && this.callbacksContainer.close) {
      this.callbacksContainer.close();
    }
  }
}

import { Component, Input } from '@angular/core';

import { ModalComponent } from '../modal-generator/modal-component.interface';
import { SubtaskModel } from '../../../game/components/complete-tasks/interfaces/subtask-model.interface';

@Component({
  selector: 'rtg-modal-subtask-info',
  templateUrl: './modal-subtask-info.component.html'
})
export class ModalSubtaskInfoComponent implements ModalComponent {
  @Input()
  data: { subtask: SubtaskModel };

  @Input()
  callbacksContainer: { close?: () => void };

  okHandler() {
    if (this.callbacksContainer && this.callbacksContainer.close) {
      this.callbacksContainer.close();
    }
  }
}

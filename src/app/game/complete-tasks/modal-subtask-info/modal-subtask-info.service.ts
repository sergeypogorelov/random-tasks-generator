import { Injectable } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { ModalSubtaskInfoCallbacksContainer } from './modal-subtask-info-callbacks-container.interface';
import { ModalInfo } from 'src/app/core/services/modal/modal-info.interface';
import { ModalSubtaskInfoComponent } from './modal-subtask-info.component';
import { SubtaskModel } from '../subtask-model.interface';

@Injectable()
export class ModalSubtaskInfoService {
  constructor(private modalService: ModalService) {}

  /**
   * generates a confirm modal with specified tag and callbacks
   *
   * @param tag modal tag
   * @param subtask subtask model
   * @param callbacksContainer callbacks on close
   */
  createAndShowSubtaskInfoModal(
    tag: string,
    subtask: SubtaskModel,
    callbacksContainer?: ModalSubtaskInfoCallbacksContainer
  ) {
    const newCallbacksContainer: ModalSubtaskInfoCallbacksContainer = {
      close: () => {
        this.modalService.hide(tag);
        if (callbacksContainer && callbacksContainer.close) {
          callbacksContainer.close();
        }
      }
    };

    const modalInfo: ModalInfo = {
      tag,
      callbacksContainer: newCallbacksContainer,
      component: ModalSubtaskInfoComponent,
      componentData: { subtask }
    };

    this.modalService.show(modalInfo);
  }
}

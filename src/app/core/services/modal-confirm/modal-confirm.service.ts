import { Injectable } from '@angular/core';

import { ModalInfo } from '../modal/modal-info.interface';
import { ModalConfirmCallbacksContainer } from '../../../shared/components/modal-confirm/modal-confirm-callbacks-container.interface';

import { ModalService } from '../modal/modal.service';

import { ModalConfirmComponent } from '../../../shared/components/modal-confirm/modal-confirm.component';

@Injectable()
export class ModalConfirmService {
  constructor(private modalService: ModalService) {}

  /**
   * generates a confirm modal with specified tag and callbacks
   *
   * @param tag modal tag
   * @param callbacksContainer callbacks on confirm and close
   */
  createAndShowConfirmModal(tag: string, callbacksContainer: ModalConfirmCallbacksContainer) {
    const newCallbacksContainer: ModalConfirmCallbacksContainer = {
      confirm: () => {
        this.modalService.hide(tag);
        if (callbacksContainer.confirm) {
          callbacksContainer.confirm();
        }
      },
      close: () => {
        this.modalService.hide(tag);
        if (callbacksContainer.close) {
          callbacksContainer.close();
        }
      }
    };

    const modalInfo: ModalInfo = {
      tag,
      callbacksContainer: newCallbacksContainer,
      component: ModalConfirmComponent
    };

    this.modalService.show(modalInfo);
  }
}

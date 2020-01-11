import { Injectable } from '@angular/core';

import { ModalInfo } from '../modal/modal-info.interface';

import { ModalService } from '../modal/modal.service';

import { ModalAlertComponent } from '../../../shared/components/modal-alert/modal-alert.component';

@Injectable()
export class ModalAlertService {
  constructor(private modalService: ModalService) {}

  /**
   * generates an alert modal with specified tag and callbacks
   *
   * @param tag modal tag
   * @param message modal message
   * @param callbacksContainer callbacks on confirm and close
   */
  createAndShowAlertModal(tag: string, message: string, callbacksContainer?: { close: () => void }) {
    const newCallbacksContainer = {
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
      component: ModalAlertComponent,
      componentData: { message }
    };

    this.modalService.show(modalInfo);
  }
}

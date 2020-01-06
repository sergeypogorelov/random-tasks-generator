import { Injectable } from '@angular/core';

import { ModalInfo } from '../modal/modal-info.interface';
import { SubtaskModel } from '../../../game/components/complete-tasks/interfaces/subtask-model.interface';

import { ModalService } from '../modal/modal.service';

import { ModalSubtaskInfoComponent } from '../../../shared/components/modal-subtask-info/modal-subtask-info.component';

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
  createAndShowSubtaskInfoModal(tag: string, subtask: SubtaskModel, callbacksContainer?: { close?: () => void }) {
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
      component: ModalSubtaskInfoComponent,
      componentData: { subtask }
    };

    this.modalService.show(modalInfo);
  }
}

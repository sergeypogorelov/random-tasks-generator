import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { ModalInfo } from './modal-info.interface';

@Injectable()
export class ModalService {
  /**
   * emits each time a modal is being shown
   */
  get showObservable(): Observable<ModalInfo> {
    return this.showSubject.asObservable();
  }

  /**
   * emits each time a modal is being hidden
   */
  get hideObservable(): Observable<string> {
    return this.hideSubject.asObservable();
  }

  /**
   * subject for showObservable
   */
  private showSubject = new Subject<ModalInfo>();

  /**
   * subject for hideObservable
   */
  private hideSubject = new Subject<string>();

  /**
   * generates and shows the specified modal
   *
   * @param modalInfo modal parameters
   */
  show(modalInfo: ModalInfo) {
    this.showSubject.next(modalInfo);
  }

  /**
   * destroys and therefore hides the specified modal by its tag
   *
   * @param modalTag tag of the modal to hide
   */
  hide(modalTag: string) {
    this.hideSubject.next(modalTag);
  }
}

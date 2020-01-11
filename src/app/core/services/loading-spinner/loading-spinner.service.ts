import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class LoadingSpinnerService {
  /**
   * the loader notifier
   *
   * emits true when the loader should be displayed
   * emits false otherwise
   */
  get observable(): Observable<boolean> {
    return this.subject.asObservable();
  }

  /**
   * count of calls for displaying the loader
   */
  private count = 0;

  /**
   * subject for the loader notifier
   */
  private subject = new Subject<boolean>();

  /**
   * shows the loader
   * can be called multiple times
   */
  showLoader() {
    if (this.count === 0) {
      this.subject.next(true);
    }

    this.count++;
  }

  /**
   * hides the loader
   * can be called multiple times
   */
  hideLoader() {
    if (this.count === 0) {
      return;
    }

    if (this.count - 1 === 0) {
      this.subject.next(false);
    }

    this.count--;
  }

  /**
   * hides the loader regardless how much times 'showLoader' has been called
   */
  enforceHideLoader() {
    this.subject.next(false);
    this.count = 0;
  }
}

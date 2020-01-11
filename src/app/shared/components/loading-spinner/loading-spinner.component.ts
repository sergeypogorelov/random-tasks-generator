import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoadingSpinnerService } from '../../../core/services/loading-spinner/loading-spinner.service';

@Component({
  selector: 'rtg-loading-spinner',
  styleUrls: ['./loading-spinner.component.scss'],
  templateUrl: './loading-spinner.component.html'
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {
  /**
   * indicates if the loader is displayed
   */
  shown = false;

  /**
   * subscription for the service
   */
  private subscription: Subscription;

  constructor(private loadingSpinnerService: LoadingSpinnerService) {}

  ngOnInit() {
    this.subscription = this.loadingSpinnerService.observable.subscribe(shown => (this.shown = shown));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

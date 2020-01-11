import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Subscription } from 'rxjs';

import { IdbService } from './idb/services/idb/idb.service';
import { LoadingSpinnerService } from './core/services/loading-spinner/loading-spinner.service';

@Component({
  selector: 'rtg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private idbService: IdbService,
    private loadingSpinnerService: LoadingSpinnerService
  ) {}

  ngOnInit() {
    this.subs.push(this.idbService.requestStarts.subscribe(() => this.loadingSpinnerService.showLoader()));
    this.subs.push(this.idbService.requestEnds.subscribe(() => this.loadingSpinnerService.hideLoader()));

    this.subs.push(
      this.router.events.subscribe(ev => {
        if (ev instanceof NavigationStart) {
          this.loadingSpinnerService.showLoader();
        }

        if (ev instanceof NavigationEnd || ev instanceof NavigationCancel || ev instanceof NavigationError) {
          this.loadingSpinnerService.hideLoader();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(i => i.unsubscribe());
  }
}

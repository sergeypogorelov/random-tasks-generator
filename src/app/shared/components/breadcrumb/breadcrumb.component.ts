import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LinkItem } from '../link/link-item.interface';
import { BreadcrumbService } from '../../../core/services/breadcrumb/breadcrumb.service';

@Component({
  selector: 'rtg-breadcrumb',
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  get items(): LinkItem[] {
    return this.currentItems;
  }

  private currentItems: LinkItem[];

  private subscription: Subscription;

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.currentItems = this.breadcrumbService.getItems();
    this.subscription = this.breadcrumbService.observable.subscribe(items => (this.currentItems = items));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

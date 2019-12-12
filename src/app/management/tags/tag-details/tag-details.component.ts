import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { linkLabels } from '../../../core/constants/link-labels';
import { urlFragments } from '../../../core/constants/url-fragments';
import { BreadcrumbService } from '../../../core/services/breadcrumb/breadcrumb.service';

export const idOfNewTag = 'new';

export const labelOfNewTag = 'New';

@Component({
  selector: 'rtg-tag-details',
  templateUrl: './tag-details.component.html'
})
export class TagDetailsComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(params => this.routeParamsHandler(params));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  routeParamsHandler(params: Params) {
    this.setBreadcrumb(params);
  }

  setBreadcrumb(params: Params) {
    const tagLabel = params.id === idOfNewTag ? labelOfNewTag : params.id;

    this.breadcrumbService.setItems([
      {
        label: linkLabels.management,
        routerLink: [`/${urlFragments.management}`]
      },
      {
        label: linkLabels.managementChilds.tags,
        routerLink: [`/${urlFragments.management}`, urlFragments.managementChilds.tags]
      },
      {
        label: tagLabel
      }
    ]);
  }
}

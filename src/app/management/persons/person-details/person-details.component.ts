import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { linkLabels } from '../../../core/constants/link-labels';
import { urlFragments } from '../../../core/constants/url-fragments';
import { BreadcrumbService } from '../../../core/services/breadcrumb/breadcrumb.service';

export const idOfNewPerson = 'new-person';

export const labelOfNewPerson = 'New Person';

@Component({
  selector: 'rtg-person-details',
  templateUrl: './person-details.component.html'
})
export class PersonDetailsComponent implements OnInit, OnDestroy {
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
    const personLabel = params.id === idOfNewPerson ? labelOfNewPerson : params.id;

    this.breadcrumbService.setItems([
      {
        label: linkLabels.management,
        routerLink: [`/${urlFragments.management}`]
      },
      {
        label: linkLabels.managementChilds.persons,
        routerLink: [`/${urlFragments.management}`, urlFragments.managementChilds.persons]
      },
      {
        label: personLabel
      }
    ]);
  }
}

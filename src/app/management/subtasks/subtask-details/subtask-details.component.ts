import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { linkLabels } from '../../../core/constants/link-labels';
import { urlFragments } from '../../../core/constants/url-fragments';
import { BreadcrumbService } from '../../../core/services/breadcrumb/breadcrumb.service';

export const idOfNewSubtask = 'new-subtask';

export const labelOfNewSubtask = 'New Subtask';

@Component({
  selector: 'rtg-subtask-details',
  templateUrl: './subtask-details.component.html'
})
export class SubtaskDetailsComponent implements OnInit, OnDestroy {
  tags: string[] = ['beach', 'car', 'sport', 'shopping'];

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
    const subtaskLabel = params.id === idOfNewSubtask ? labelOfNewSubtask : params.id;

    this.breadcrumbService.setItems([
      {
        label: linkLabels.management,
        routerLink: [`/${urlFragments.management}`]
      },
      {
        label: linkLabels.managementChilds.subtasks,
        routerLink: [`/${urlFragments.management}`, urlFragments.managementChilds.subtasks]
      },
      {
        label: subtaskLabel
      }
    ]);
  }
}

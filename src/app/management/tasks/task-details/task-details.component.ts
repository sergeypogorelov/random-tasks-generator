import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { linkLabels } from '../../../core/constants/link-labels';
import { urlFragments } from '../../../core/constants/url-fragments';
import { BreadcrumbService } from '../../../core/services/breadcrumb/breadcrumb.service';

export const idOfNewTask = 'new-task';

export const labelOfNewTask = 'New Task';

@Component({
  selector: 'rtg-task-details',
  templateUrl: './task-details.component.html'
})
export class TaskDetailsComponent implements OnInit, OnDestroy {
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
    const taskLabel = params.id === idOfNewTask ? labelOfNewTask : params.id;

    this.breadcrumbService.setItems([
      {
        label: linkLabels.management,
        routerLink: [`/${urlFragments.management}`]
      },
      {
        label: linkLabels.managementChilds.tasks,
        routerLink: [`/${urlFragments.management}`, urlFragments.managementChilds.tasks]
      },
      {
        label: taskLabel
      }
    ]);
  }
}

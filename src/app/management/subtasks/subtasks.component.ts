import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { linkLabels } from '../../core/constants/link-labels';
import { urlFragments } from '../../core/constants/url-fragments';
import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';

import { idOfNewSubtask } from './subtask-details/subtask-details.component';

@Component({
  selector: 'rtg-subtasks',
  templateUrl: './subtasks.component.html'
})
export class SubtasksComponent implements OnInit {
  constructor(private router: Router, private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.breadcrumbService.setItems([
      {
        label: linkLabels.management,
        routerLink: [`/${urlFragments.management}`]
      },
      {
        label: linkLabels.managementChilds.subtasks
      }
    ]);
  }

  newButtonClickHandler() {
    this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.subtasks, idOfNewSubtask]);
  }
}

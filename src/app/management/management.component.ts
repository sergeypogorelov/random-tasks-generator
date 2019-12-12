import { Component, OnInit } from '@angular/core';

import { linkLabels } from '../core/constants/link-labels';
import { urlFragments } from '../core/constants/url-fragments';

import { LinkItem } from '../shared/components/link/link-item.interface';
import { BreadcrumbService } from '../core/services/breadcrumb/breadcrumb.service';

@Component({
  selector: 'rtg-management',
  templateUrl: './management.component.html'
})
export class ManagementComponent implements OnInit {
  linkForPartPersons: LinkItem = {
    label: linkLabels.managementChilds.persons,
    routerLink: [`/${urlFragments.management}`, urlFragments.managementChilds.persons]
  };

  linkForPartTasks: LinkItem = {
    label: linkLabels.managementChilds.tasks,
    routerLink: [`/${urlFragments.management}`, urlFragments.managementChilds.tasks]
  };

  linkForPartSubtasks: LinkItem = {
    label: linkLabels.managementChilds.subtasks,
    routerLink: [`/${urlFragments.management}`, urlFragments.managementChilds.subtasks]
  };

  linkForPartTags: LinkItem = {
    label: linkLabels.managementChilds.tags,
    routerLink: [`/${urlFragments.management}`, urlFragments.managementChilds.tags]
  };

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.breadcrumbService.setItems([
      {
        label: linkLabels.management
      }
    ]);
  }
}

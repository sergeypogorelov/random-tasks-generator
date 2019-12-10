import { Component, OnInit } from '@angular/core';

import { linkLabels } from '../../core/constants/link-labels';
import { urlFragments } from '../../core/constants/url-fragments';

import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';

@Component({
  selector: 'rtg-complete-tasks',
  styleUrls: ['./complete-tasks.component.scss'],
  templateUrl: './complete-tasks.component.html'
})
export class CompleteTasksComponent implements OnInit {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.breadcrumbService.setItems([
      {
        label: linkLabels.home,
        routerLink: [`/${urlFragments.home}`]
      },
      {
        label: linkLabels.gameChilds.selectPerson,
        routerLink: [`/${urlFragments.game}`, urlFragments.gameChilds.selectPerson]
      },
      {
        label: linkLabels.gameChilds.getTasks,
        routerLink: [`/${urlFragments.game}`, urlFragments.gameChilds.getTasks]
      },
      {
        label: linkLabels.gameChilds.completeTasks
      }
    ]);
  }
}

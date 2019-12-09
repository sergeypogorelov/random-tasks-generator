import { Component, OnInit } from '@angular/core';

import { linkLabels } from '../../core/constants/link-labels';
import { urlFragments } from '../../core/constants/url-fragments';

import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';

@Component({
  selector: 'rtg-get-tasks',
  templateUrl: './get-tasks.component.html'
})
export class GetTasksComponent implements OnInit {
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
        label: linkLabels.gameChilds.getTasks
      }
    ]);
  }
}

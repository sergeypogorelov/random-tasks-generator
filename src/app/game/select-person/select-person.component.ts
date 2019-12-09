import { Component, OnInit } from '@angular/core';

import { linkLabels } from '../../core/constants/link-labels';
import { urlFragments } from '../../core/constants/url-fragments';

import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';

@Component({
  selector: 'rtg-select-person',
  templateUrl: './select-person.component.html'
})
export class SelectPersonComponent implements OnInit {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.breadcrumbService.setItems([
      {
        label: linkLabels.home,
        routerLink: [`/${urlFragments.home}`]
      },
      {
        label: linkLabels.gameChilds.selectPerson
      }
    ]);
  }
}

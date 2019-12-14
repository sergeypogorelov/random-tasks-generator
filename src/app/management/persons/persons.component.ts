import { Component, OnInit } from '@angular/core';

import { linkLabels } from '../../core/constants/link-labels';
import { urlFragments } from '../../core/constants/url-fragments';
import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';

@Component({
  selector: 'rtg-persons',
  templateUrl: './persons.component.html'
})
export class PersonsComponent implements OnInit {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.breadcrumbService.setItems([
      {
        label: linkLabels.management,
        routerLink: [`/${urlFragments.management}`]
      },
      {
        label: linkLabels.managementChilds.persons
      }
    ]);
  }

  newButtonClickHandler() {}
}

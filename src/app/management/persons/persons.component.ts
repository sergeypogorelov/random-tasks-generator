import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { linkLabels } from '../../core/constants/link-labels';
import { urlFragments } from '../../core/constants/url-fragments';
import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';

import { idOfNewPerson } from './person-details/person-details.component';

@Component({
  selector: 'rtg-persons',
  templateUrl: './persons.component.html'
})
export class PersonsComponent implements OnInit {
  constructor(private router: Router, private breadcrumbService: BreadcrumbService) {}

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

  newButtonClickHandler() {
    this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.persons, idOfNewPerson]);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { linkLabels } from '../../core/constants/link-labels';
import { urlFragments } from '../../core/constants/url-fragments';
import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';

import { idOfNewTag } from './tag-details/tag-details.component';

@Component({
  selector: 'rtg-tags',
  templateUrl: './tags.component.html'
})
export class TagsComponent implements OnInit {
  constructor(private router: Router, private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.breadcrumbService.setItems([
      {
        label: linkLabels.management,
        routerLink: [`/${urlFragments.management}`]
      },
      {
        label: linkLabels.managementChilds.tags
      }
    ]);
  }

  newButtonClickHandler() {
    this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.tags, idOfNewTag]);
  }
}

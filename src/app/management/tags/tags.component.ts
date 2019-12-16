import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { linkLabels } from '../../core/constants/link-labels';
import { urlFragments } from '../../core/constants/url-fragments';

import { Tag } from 'src/app/core/interfaces/tag/tag.interface';

import { TagService } from 'src/app/core/services/tag/tag.service';
import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';

import { idOfNewTag } from './tag-details/tag-details.component';

@Component({
  selector: 'rtg-tags',
  templateUrl: './tags.component.html'
})
export class TagsComponent implements OnInit, OnDestroy {
  tags: Tag[] = [];

  private subscription: Subscription;

  constructor(private router: Router, private tagService: TagService, private breadcrumbService: BreadcrumbService) {}

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

    this.subscription = this.tagService.getAll().subscribe(tags => (this.tags = tags));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  newButtonClickHandler() {
    this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.tags, idOfNewTag]);
  }
}

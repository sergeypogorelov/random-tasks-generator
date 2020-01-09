import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { linkLabels } from '../../core/constants/link-labels';
import { urlFragments } from '../../core/constants/url-fragments';

import { Tag } from 'src/app/core/interfaces/tag/tag.interface';

import { TagService } from 'src/app/core/services/tag/tag.service';
import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';
import { ModalConfirmService } from 'src/app/core/services/modal-confirm/modal-confirm.service';

import { idOfNewTag } from './tag-details/tag-details.component';

@Component({
  selector: 'rtg-tags',
  templateUrl: './tags.component.html'
})
export class TagsComponent implements OnInit, OnDestroy {
  search: string;

  tags: Tag[] = [];

  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tagService: TagService,
    private breadcrumbService: BreadcrumbService,
    private modalConfirmService: ModalConfirmService
  ) {}

  ngOnInit() {
    this.activateListeningToQueryParams();
    this.setBreadcrumb();
    this.updateGrid();
  }

  ngOnDestroy() {
    this.subs.forEach(i => i.unsubscribe());
  }

  newButtonClickHandler() {
    this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.tags, idOfNewTag]);
  }

  gridSearchValueChangeHandler(search: string) {
    this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.tags], {
      queryParams: { search }
    });
  }

  editButtonClickHandler(tag: Tag) {
    this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.tags, tag.id]);
  }

  removeButtonClickHandler(tag: Tag) {
    this.modalConfirmService.createAndShowConfirmModal('remove-tag', {
      confirm: () => {
        this.subs.push(this.tagService.deleteTag(tag.id).subscribe(() => this.updateGrid()));
      }
    });
  }

  private activateListeningToQueryParams() {
    this.subs.push(this.route.queryParams.subscribe(params => (this.search = params.search)));
  }

  private setBreadcrumb() {
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

  private updateGrid() {
    this.subs.push(this.tagService.getAllTags().subscribe(tags => (this.tags = tags)));
  }
}

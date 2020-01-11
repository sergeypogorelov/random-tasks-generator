import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { linkLabels } from '../../core/constants/link-labels';
import { urlFragments } from '../../core/constants/url-fragments';

import { Tag } from '../../core/interfaces/tag/tag.interface';

import { TagService } from '../../core/services/tag/tag.service';
import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';
import { ModalAlertService } from '../../core/services/modal-alert/modal-alert.service';
import { ModalConfirmService } from '../../core/services/modal-confirm/modal-confirm.service';

import { idOfNewTag } from './tag-details/tag-details.component';

const CANNOT_DELETE_MESSAGE = 'The tag cannot be deleted as it is already in use.';

@Component({
  selector: 'rtg-tags',
  templateUrl: './tags.component.html'
})
export class TagsComponent implements OnInit, OnDestroy {
  search: string;

  page: number;

  tags: Tag[] = [];

  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tagService: TagService,
    private breadcrumbService: BreadcrumbService,
    private modalAlertService: ModalAlertService,
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

  gridSearchValueChangeHandler(search: string) {
    const page = 1;

    this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.tags], {
      queryParams: { search, page }
    });
  }

  gridPageChangeHandler(page: number) {
    const search = this.search;

    this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.tags], {
      queryParams: { search, page }
    });
  }

  removeButtonClickHandler(tag: Tag) {
    this.modalConfirmService.createAndShowConfirmModal('remove-tag', {
      confirm: () => {
        this.subs.push(
          this.tagService.checkIfTagIdsUnused([tag.id]).subscribe(unused => {
            if (unused) {
              this.subs.push(this.tagService.deleteTag(tag.id).subscribe(() => this.updateGrid()));
            } else {
              this.modalAlertService.createAndShowAlertModal('remove-tag-fail', CANNOT_DELETE_MESSAGE);
            }
          })
        );
      }
    });
  }

  getRouterLinkToAdd() {
    return [`/${urlFragments.management}`, urlFragments.managementChilds.tags, idOfNewTag];
  }

  getRouterLinkToEdit(dataItem: Tag) {
    return [`/${urlFragments.management}`, urlFragments.managementChilds.tags, dataItem.id];
  }

  private activateListeningToQueryParams() {
    this.subs.push(
      this.route.queryParams.subscribe(params => {
        this.search = params.search || '';
        this.page = +params.page || 1;
      })
    );
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { linkLabels } from '../../core/constants/link-labels';
import { urlFragments } from '../../core/constants/url-fragments';

import { SubtaskGridModel } from './subtask-grid-model.interface';

import { SubtaskService } from '../../core/services/subtask/subtask.service';
import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';
import { ModalAlertService } from '../../core/services/modal-alert/modal-alert.service';
import { ModalConfirmService } from '../../core/services/modal-confirm/modal-confirm.service';
import { SubtasksPageService } from './subtasks-page.service';

import { idOfNewSubtask } from './subtask-details/subtask-details.component';

const CANNOT_DELETE_MESSAGE = 'The subtask cannot be deleted as it is already in use.';

@Component({
  selector: 'rtg-subtasks',
  templateUrl: './subtasks.component.html'
})
export class SubtasksComponent implements OnInit, OnDestroy {
  search: string;

  page: number;

  subtaskModels: SubtaskGridModel[] = [];

  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subtaskService: SubtaskService,
    private breadcrumbService: BreadcrumbService,
    private modalAlertService: ModalAlertService,
    private modalConfirmService: ModalConfirmService,
    private subtasksPageService: SubtasksPageService
  ) {}

  ngOnInit() {
    this.activateListeningToQueryParams();
    this.setBreadcrumb();
    this.updateGrid();
  }

  ngOnDestroy() {
    this.subs.forEach(i => i.unsubscribe());

    this.subtasksPageService.revokeImgUrls();
  }

  gridSearchValueChangeHandler(search: string) {
    const page = 1;

    this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.subtasks], {
      queryParams: { search, page }
    });
  }

  gridPageChangeHandler(page: number) {
    const search = this.search;

    this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.subtasks], {
      queryParams: { search, page }
    });
  }

  removeButtonClickHandler(subtask: SubtaskGridModel) {
    this.modalConfirmService.createAndShowConfirmModal('remove-subtask', {
      confirm: () => {
        this.subs.push(
          this.subtaskService.checkIfIdUnused(subtask.id).subscribe(unused => {
            if (unused) {
              this.subs.push(this.subtaskService.deleteSubtask(subtask.id).subscribe(() => this.updateGrid()));
            } else {
              this.modalAlertService.createAndShowAlertModal('remove-subtask-fail', CANNOT_DELETE_MESSAGE);
            }
          })
        );
      }
    });
  }

  getRouterLinkToAdd() {
    return [`/${urlFragments.management}`, urlFragments.managementChilds.subtasks, idOfNewSubtask];
  }

  getRouterLinkToEdit(dataItem: SubtaskGridModel) {
    return [`/${urlFragments.management}`, urlFragments.managementChilds.subtasks, dataItem.id];
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
        label: linkLabels.managementChilds.subtasks
      }
    ]);
  }

  private updateGrid() {
    this.subs.push(
      this.subtaskService
        .getAllSubtasks()
        .pipe(mergeMap(subtasks => forkJoin(subtasks.map(i => this.subtasksPageService.castDtoToModel(i)))))
        .subscribe(models => (this.subtaskModels = models))
    );
  }
}

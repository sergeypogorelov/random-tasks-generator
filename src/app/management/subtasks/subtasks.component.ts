import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { linkLabels } from '../../core/constants/link-labels';
import { urlFragments } from '../../core/constants/url-fragments';

import { SubtaskGridModel } from './subtask-grid-model.interface';

import { SubtaskService } from '../../core/services/subtask/subtask.service';
import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';
import { ModalConfirmService } from '../../core/services/modal-confirm/modal-confirm.service';
import { SubtasksPageService } from './subtasks-page.service';

import { idOfNewSubtask } from './subtask-details/subtask-details.component';

@Component({
  selector: 'rtg-subtasks',
  templateUrl: './subtasks.component.html'
})
export class SubtasksComponent implements OnInit, OnDestroy {
  subtaskModels: SubtaskGridModel[] = [];

  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private subtaskService: SubtaskService,
    private subtasksService: SubtasksPageService,
    private breadcrumbService: BreadcrumbService,
    private modalConfirmService: ModalConfirmService
  ) {}

  ngOnInit() {
    this.setBreadcrumb();
    this.updateGrid();
  }

  ngOnDestroy() {
    this.subs.forEach(i => i.unsubscribe());
  }

  newButtonClickHandler() {
    this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.subtasks, idOfNewSubtask]);
  }

  editButtonClickHandler(subtask: SubtaskGridModel) {
    this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.subtasks, subtask.id]);
  }

  removeButtonClickHandler(subtask: SubtaskGridModel) {
    this.modalConfirmService.createAndShowConfirmModal('remove-subtask', {
      confirm: () => {
        this.subs.push(this.subtaskService.deleteSubtask(subtask.id).subscribe(() => this.updateGrid()));
      }
    });
  }

  imgLoadHandler(subtask: SubtaskGridModel) {
    URL.revokeObjectURL(subtask.thumbnailDateUrl);
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
        .pipe(mergeMap(subtasks => forkJoin(subtasks.map(i => this.subtasksService.castDtoToModel(i)))))
        .subscribe(models => (this.subtaskModels = models))
    );
  }
}

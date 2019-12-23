import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { linkLabels } from '../../core/constants/link-labels';
import { urlFragments } from '../../core/constants/url-fragments';

import { SubtaskModel } from './subtask-model.interface';

import { SubtaskService } from '../../core/services/subtask/subtask.service';
import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';
import { ModalConfirmService } from '../../core/services/modal-confirm/modal-confirm.service';
import { SubtasksService } from './subtasks.service';

import { idOfNewSubtask } from './subtask-details/subtask-details.component';

@Component({
  selector: 'rtg-subtasks',
  templateUrl: './subtasks.component.html'
})
export class SubtasksComponent implements OnInit, OnDestroy {
  subtaskModels: SubtaskModel[] = [];

  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private subtaskService: SubtaskService,
    private subtasksService: SubtasksService,
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

  editButtonClickHandler(subtask: SubtaskModel) {
    this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.subtasks, subtask.id]);
  }

  removeButtonClickHandler(subtask: SubtaskModel) {
    this.modalConfirmService.createAndShowConfirmModal('remove-subtask', {
      confirm: () => {
        this.subs.push(this.subtaskService.deleteSubtask(subtask.id).subscribe(() => this.updateGrid()));
      }
    });
  }

  imgLoadHandler(subtask: SubtaskModel) {
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

import { linkLabels } from '../../core/constants/link-labels';
import { urlFragments } from '../../core/constants/url-fragments';

import { Tag } from '../../core/interfaces/tag/tag.interface';
import { Task } from '../../core/interfaces/task/task.interface';
import { TaskGridModel } from './task-grid-model.interface';

import { TagService } from '../../core/services/tag/tag.service';
import { TaskService } from '../../core/services/task/task.service';
import { BreadcrumbService } from '../../core/services/breadcrumb/breadcrumb.service';
import { ModalConfirmService } from '../../core/services/modal-confirm/modal-confirm.service';
import { TasksPageService } from './tasks-page.service';

import { idOfNewTask } from './task-details/task-details.component';

@Component({
  selector: 'rtg-tasks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit, OnDestroy {
  tags: Tag[];

  tasks: Task[];

  models: TaskGridModel[] = [];

  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private tagService: TagService,
    private taskService: TaskService,
    private tasksPageService: TasksPageService,
    private breadcrumbService: BreadcrumbService,
    private modalConfirmService: ModalConfirmService
  ) {}

  ngOnInit() {
    this.setBreadcrumb();
    this.updateGrid();
  }

  ngOnDestroy() {
    this.subs.forEach(i => i.unsubscribe());

    this.tasksPageService.revokeImgUrls();
  }

  newButtonClickHandler() {
    this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.tasks, idOfNewTask]);
  }

  editButtonClickHandler(subtask: TaskGridModel) {
    this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.tasks, subtask.id]);
  }

  removeButtonClickHandler(subtask: TaskGridModel) {
    this.modalConfirmService.createAndShowConfirmModal('remove-task', {
      confirm: () => {
        this.subs.push(this.taskService.delete(subtask.id).subscribe(() => this.updateGrid()));
      }
    });
  }

  private setBreadcrumb() {
    this.breadcrumbService.setItems([
      {
        label: linkLabels.management,
        routerLink: [`/${urlFragments.management}`]
      },
      {
        label: linkLabels.managementChilds.tasks
      }
    ]);
  }

  private updateGrid() {
    this.subs.push(
      forkJoin(this.loadAndSetTags(), this.loadAndSetTasks()).subscribe(results => {
        const tags = results[0];
        const tasks = results[1];

        this.models = tasks.map(task => this.tasksPageService.castDtoToModel(task, tags));
      })
    );
  }

  private loadAndSetTasks(): Observable<Task[]> {
    return this.taskService.getAll().pipe(tap(tasks => (this.tasks = tasks)));
  }

  private loadAndSetTags(): Observable<Tag[]> {
    return this.tagService.getAllTags().pipe(tap(tags => (this.tags = tags)));
  }
}

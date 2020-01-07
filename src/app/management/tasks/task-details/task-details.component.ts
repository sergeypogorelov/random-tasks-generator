import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { linkLabels } from '../../../core/constants/link-labels';
import { urlFragments } from '../../../core/constants/url-fragments';

import { Task } from '../../../core/interfaces/task/task.interface';
import { Tag } from '../../../core/interfaces/tag/tag.interface';
import { TaskModel } from './task-model.interface';

import { TagService } from '../../../core/services/tag/tag.service';
import { TaskService } from '../../../core/services/task/task.service';
import { BreadcrumbService } from '../../../core/services/breadcrumb/breadcrumb.service';
import { TaskDetailsPageService } from './task-details-page.service';

export const idOfNewTask = 'new-task';

export const labelOfNewTask = 'New Task';

@Component({
  selector: 'rtg-task-details',
  templateUrl: './task-details.component.html'
})
export class TaskDetailsComponent implements OnInit, OnDestroy {
  task: Task;

  tags: Tag[] = [];

  form: FormGroup;

  get formTitle(): AbstractControl {
    return this.form.get('title');
  }

  get formThumbnail(): AbstractControl {
    return this.form.get('thumbnail');
  }

  get formMinCount(): AbstractControl {
    return this.form.get('minCount');
  }

  get formMaxCount(): AbstractControl {
    return this.form.get('maxCount');
  }

  get formTags(): AbstractControl {
    return this.form.get('tags');
  }

  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tagService: TagService,
    private taskService: TaskService,
    private breadcrumbService: BreadcrumbService,
    private taskDetailsService: TaskDetailsPageService
  ) {}

  ngOnInit() {
    this.subs.push(this.activatedRoute.params.subscribe(params => this.routeParamsHandler(params)));
  }

  ngOnDestroy() {
    this.subs.forEach(i => i.unsubscribe());
  }

  routeParamsHandler(params: Params) {
    const isNew = params.id === idOfNewTask;

    if (isNew) {
      this.setBreadcrumb(idOfNewTask);
      this.loadAndSetTags().subscribe(() => this.setForm());
    } else {
      this.subs.push(
        this.taskService.getById(+params.id).subscribe(task => {
          this.task = task;

          this.setBreadcrumb(task.name);
          this.loadAndSetTags().subscribe(() => this.setForm(task));
        })
      );
    }
  }

  formSubmitHandler() {
    if (this.form.valid) {
      const formRawValue = this.form.getRawValue() as TaskModel;

      let action: Observable<any>;

      if (this.task) {
        const dto = this.taskDetailsService.overrideDtoByFormModel(this.task, formRawValue);
        action = this.taskService.update(dto);
      } else {
        const dto = this.taskDetailsService.castFormModelToDto(formRawValue);
        action = this.taskService.add(dto);
      }

      this.subs.push(
        action.subscribe(() =>
          this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.tasks])
        )
      );
    }
  }

  private setBreadcrumb(taskLabel: string) {
    this.breadcrumbService.setItems([
      {
        label: linkLabels.management,
        routerLink: [`/${urlFragments.management}`]
      },
      {
        label: linkLabels.managementChilds.tasks,
        routerLink: [`/${urlFragments.management}`, urlFragments.managementChilds.tasks]
      },
      {
        label: taskLabel
      }
    ]);
  }

  private setForm(task?: Task) {
    if (task) {
      const taskDetails = this.taskDetailsService.castDtoToFormModel(task, this.tags);
      this.form = this.taskDetailsService.generateFormGroup(taskDetails);
    } else {
      this.form = this.taskDetailsService.generateFormGroup();
    }
  }

  private loadAndSetTags(): Observable<Tag[]> {
    return this.tagService.getAllTags().pipe(tap(tags => (this.tags = tags)));
  }
}

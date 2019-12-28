import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { linkLabels } from '../../../core/constants/link-labels';
import { urlFragments } from '../../../core/constants/url-fragments';
import { BreadcrumbService } from '../../../core/services/breadcrumb/breadcrumb.service';
import { Person } from 'src/app/core/interfaces/person/person.interface';
import { Task } from 'src/app/core/interfaces/task/task.interface';
import { Tag } from 'src/app/core/interfaces/tag/tag.interface';
import { AbstractControl, FormGroup, FormArray, Form } from '@angular/forms';
import { TagService } from 'src/app/core/services/tag/tag.service';
import { TaskService } from 'src/app/core/services/task/task.service';
import { PersonDetailsService } from './person-details.service';
import { PersonDetails } from './interfaces/person-details.interface';

export const idOfNewPerson = 'new-person';

export const labelOfNewPerson = 'New Person';

@Component({
  selector: 'rtg-person-details',
  templateUrl: './person-details.component.html'
})
export class PersonDetailsComponent implements OnInit, OnDestroy {
  person: Person;

  tasks: Task[];

  tags: Tag[];

  form: FormGroup;

  get formTitle(): AbstractControl {
    return this.form.get('title');
  }

  get formThumbnail(): AbstractControl {
    return this.form.get('thumbnail');
  }

  get formIterations(): FormArray {
    return this.form.get('iterations') as FormArray;
  }

  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tagService: TagService,
    private taskService: TaskService,
    private breadcrumbService: BreadcrumbService,
    private personDetailsService: PersonDetailsService
  ) {}

  ngOnInit() {
    this.subs.push(this.activatedRoute.params.subscribe(params => this.routeParamsHandler(params)));
  }

  ngOnDestroy() {
    this.subs.forEach(i => i.unsubscribe());
  }

  routeParamsHandler(params: Params) {
    this.setBreadcrumb(params);
    this.setForm();
  }

  addIterationButtonClickHandler() {
    const formArray = this.form.get('iterations') as FormArray;
    formArray.push(this.personDetailsService.generateIterationFormGroup());
  }

  addTaskButtonClickHandler(iterationNumber: number) {
    const iterations = this.form.get('iterations') as FormArray;
    const tasks = iterations.at(iterationNumber).get('tasks') as FormArray;
    const task = this.personDetailsService.generateTaskFormGroup();
    const taskIdControl = task.get('id');
    taskIdControl.valueChanges.subscribe(() => {
      const tags = task.get('tags') as FormArray;
      tags.clear();
      tags.push(this.personDetailsService.generateTagFormGroup('1', 'Tag 1'));
      tags.push(this.personDetailsService.generateTagFormGroup('2', 'Tag 2'));
    });
    tasks.push(task);
  }

  getTaskControls(iteration: FormGroup): AbstractControl[] {
    if (!iteration) {
      throw new Error('Iteration is not specified.');
    }

    return (iteration.controls.tasks as FormArray).controls;
  }

  getTagControls(task: FormGroup): AbstractControl[] {
    if (!task) {
      throw new Error('Task is not specified.');
    }

    return (task.controls.tags as FormArray).controls;
  }

  private setBreadcrumb(params: Params) {
    const personLabel = params.id === idOfNewPerson ? labelOfNewPerson : params.id;

    this.breadcrumbService.setItems([
      {
        label: linkLabels.management,
        routerLink: [`/${urlFragments.management}`]
      },
      {
        label: linkLabels.managementChilds.persons,
        routerLink: [`/${urlFragments.management}`, urlFragments.managementChilds.persons]
      },
      {
        label: personLabel
      }
    ]);
  }

  private setForm(personDetails: PersonDetails = null) {
    this.form = this.personDetailsService.generateFormGroup(personDetails);
  }
}

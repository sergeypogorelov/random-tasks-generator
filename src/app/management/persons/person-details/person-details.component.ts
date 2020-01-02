import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IDatePickerConfig } from 'ng2-date-picker';

import { linkLabels } from '../../../core/constants/link-labels';
import { urlFragments } from '../../../core/constants/url-fragments';

import { ProbabilityRange } from '../../../core/enums/probability-range.enum';

import { ValueAndLabel } from '../../../core/interfaces/common/value-and-label.interface';
import { Person } from '../../../core/interfaces/person/person.interface';
import { Task } from '../../../core/interfaces/task/task.interface';
import { Tag } from '../../../core/interfaces/tag/tag.interface';
import { PersonModel } from './interfaces/person-model.interface';

import { Utils } from '../../../core/helpers/utils.class';

import { TagService } from '../../../core/services/tag/tag.service';
import { TaskService } from '../../../core/services/task/task.service';
import { PersonService } from '../../../core/services/person/person.service';
import { BreadcrumbService } from '../../../core/services/breadcrumb/breadcrumb.service';
import { PersonDetailsService } from './person-details.service';

export const idOfNewPerson = 'new-person';

export const labelOfNewPerson = 'New Person';

@Component({
  selector: 'rtg-person-details',
  styleUrls: ['./person-details.component.scss'],
  templateUrl: './person-details.component.html'
})
export class PersonDetailsComponent implements OnInit, OnDestroy {
  person: Person;

  tasks: Task[];

  tags: Tag[];

  form: FormGroup;

  tasksForDropdown: ValueAndLabel[];

  probabilityRangeItems: ValueAndLabel[];

  datePickerCfg: IDatePickerConfig = {
    disableKeypress: true,
    format: 'YYYY-MM-DD'
  };

  get formName(): AbstractControl {
    return this.form.get('name');
  }

  get formThumbnail(): AbstractControl {
    return this.form.get('thumbnail');
  }

  get formStartDate(): AbstractControl {
    return this.form.get('startDate');
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
    private personService: PersonService,
    private breadcrumbService: BreadcrumbService,
    private personDetailsService: PersonDetailsService
  ) {
    this.probabilityRangeItems = Utils.enumAsValueAndLabel(ProbabilityRange);
  }

  ngOnInit() {
    this.subs.push(this.activatedRoute.params.subscribe(params => this.routeParamsHandler(params)));
  }

  ngOnDestroy() {
    this.subs.forEach(i => i.unsubscribe());
  }

  routeParamsHandler(params: Params) {
    const isNew = params.id === idOfNewPerson;

    if (isNew) {
      this.setBreadcrumb(labelOfNewPerson);
      this.subs.push(this.loadAndSetEntities().subscribe(() => this.setForm()));
    } else {
      this.subs.push(
        this.personService.getById(+params.id).subscribe(person => {
          this.person = person;

          this.setBreadcrumb(person.name);
          this.subs.push(this.loadAndSetEntities().subscribe(() => this.setForm(person)));
        })
      );
    }
  }

  addIterationButtonClickHandler() {
    const formArray = this.form.get('iterations') as FormArray;
    formArray.push(this.personDetailsService.generateIterationFormGroup());
  }

  addTaskButtonClickHandler(iterationControl: FormGroup) {
    const taskControl = this.personDetailsService.generateTaskFormGroup();

    this.activateListeningToIdForTaskControl(taskControl);

    (iterationControl.get('tasks') as FormArray).push(taskControl);
  }

  formSubmitHandler() {
    if (this.form.valid) {
      let action: Observable<Person>;

      const formRawValue = this.form.getRawValue() as PersonModel;

      if (this.person) {
        const updatedDto = this.personDetailsService.overrideDtoByModel(this.person, formRawValue);
        action = this.personService.update(updatedDto);
      } else {
        const newDto = this.personDetailsService.castModelToDto(formRawValue);
        action = this.personService.add(newDto);
      }

      this.subs.push(
        action.subscribe(() =>
          this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.persons])
        )
      );
    } else {
      this.form.markAllAsTouched();
    }
  }

  getTaskControls(iteration: FormGroup): AbstractControl[] {
    if (!iteration) {
      throw new Error('Iteration is not specified.');
    }

    return (iteration.get('tasks') as FormArray).controls;
  }

  getTagControls(task: FormGroup): AbstractControl[] {
    if (!task) {
      throw new Error('Task is not specified.');
    }

    return (task.get('tags') as FormArray).controls;
  }

  private setBreadcrumb(personLabel: string) {
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

  private setForm(person: Person = null) {
    let personModel: PersonModel = null;

    if (person) {
      personModel = this.personDetailsService.castDtoToModel(person, this.tags);
    }

    this.form = this.personDetailsService.generateFormGroup(personModel);

    const iterationsFormArray = this.form.get('iterations') as FormArray;
    for (const iterationControl of iterationsFormArray.controls) {
      const tasksFormArray = iterationControl.get('tasks') as FormArray;

      tasksFormArray.controls.forEach(taskControl =>
        this.activateListeningToIdForTaskControl(taskControl as FormGroup)
      );
    }

    this.form.valueChanges.subscribe(i => console.log(i));
  }

  private activateListeningToIdForTaskControl(taskControl: FormGroup) {
    if (!taskControl) {
      throw new Error('Task control is not specified.');
    }

    this.subs.push(
      taskControl.get('id').valueChanges.subscribe(taskId => {
        const task = this.tasks.find(i => i.id === +taskId);
        const tags = this.tags.filter(i => task.tagIds.includes(i.id));

        const tagsFormArray = taskControl.get('tags') as FormArray;
        tagsFormArray.clear();
        for (const tag of tags) {
          tagsFormArray.push(this.personDetailsService.generateTagFormGroup(`${tag.id}`, tag.name));
        }
      })
    );
  }

  private loadAndSetEntities(): Observable<[Task[], Tag[]]> {
    return forkJoin(this.loadAndSetTasks(), this.loadAndSetTags());
  }

  private loadAndSetTasks(): Observable<Task[]> {
    return this.taskService.getAll().pipe(
      tap(tasks => {
        this.tasks = tasks;
        this.tasksForDropdown = tasks.map(i => ({ value: `${i.id}`, label: i.name }));
      })
    );
  }

  private loadAndSetTags(): Observable<Tag[]> {
    return this.tagService.getAllTags().pipe(tap(tags => (this.tags = tags)));
  }
}

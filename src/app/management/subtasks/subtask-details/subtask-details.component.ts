import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

import { linkLabels } from '../../../core/constants/link-labels';
import { urlFragments } from '../../../core/constants/url-fragments';

import { Subtask } from '../../../core/interfaces/subtask/subtask.interface';

import { BreadcrumbService } from '../../../core/services/breadcrumb/breadcrumb.service';
import { Tag } from 'src/app/core/interfaces/tag/tag.interface';
import { SubtaskService } from 'src/app/core/services/subtask/subtask.service';
import { SubtaskDetailsService } from './subtask-details.service';
import { TagService } from 'src/app/core/services/tag/tag.service';
import { SubtaskDetails } from './subtask-details.interface';
import { tap } from 'rxjs/operators';

export const idOfNewSubtask = 'new-subtask';

export const labelOfNewSubtask = 'New Subtask';

@Component({
  selector: 'rtg-subtask-details',
  templateUrl: './subtask-details.component.html'
})
export class SubtaskDetailsComponent implements OnInit, OnDestroy {
  form: FormGroup;

  subtask: Subtask;

  tags: Tag[] = [];

  get formTitle(): AbstractControl {
    return this.form.get('title');
  }

  get formThumbnail(): AbstractControl {
    return this.form.get('thumbnail');
  }

  get formLowProbabilityScore(): AbstractControl {
    return this.form.get('lowProbabilityScore');
  }

  get formAverageProbabilityScore(): AbstractControl {
    return this.form.get('averageProbabilityScore');
  }

  get formHighProbabilityScore(): AbstractControl {
    return this.form.get('highProbabilityScore');
  }

  get formTags(): AbstractControl {
    return this.form.get('tags');
  }

  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tagService: TagService,
    private subtaskService: SubtaskService,
    private breadcrumbService: BreadcrumbService,
    private subtaskDetailsService: SubtaskDetailsService
  ) {}

  ngOnInit() {
    this.subs.push(this.activatedRoute.params.subscribe(params => this.routeParamsHandler(params)));
  }

  ngOnDestroy() {
    this.subs.forEach(i => i.unsubscribe());
  }

  routeParamsHandler(params: Params) {
    const isNew = params.id === idOfNewSubtask;

    if (isNew) {
      this.setBreadcrumb(labelOfNewSubtask);
      this.loadAndSetTags().subscribe(() => this.setForm());
    } else {
      this.subs.push(
        this.subtaskService.getSubtaskById(+params.id).subscribe(subtask => {
          this.subtask = subtask;

          this.setBreadcrumb(subtask.name);
          this.loadAndSetTags().subscribe(() => this.setForm(subtask));
        })
      );
    }
  }

  formSubmitHandler() {
    if (this.form.valid) {
      const formRawValue = this.form.getRawValue() as SubtaskDetails;

      let action: Observable<any>;

      if (this.subtask) {
        const dto = this.subtaskDetailsService.overrideDtoByFormModel(this.subtask, formRawValue);
        action = this.subtaskService.updateSubtask(dto);
      } else {
        const dto = this.subtaskDetailsService.castFormModelToDto(formRawValue);
        action = this.subtaskService.addSubtask(dto);
      }

      this.subs.push(
        action.subscribe(() =>
          this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.subtasks])
        )
      );
    }
  }

  setBreadcrumb(subtaskLabel: string) {
    this.breadcrumbService.setItems([
      {
        label: linkLabels.management,
        routerLink: [`/${urlFragments.management}`]
      },
      {
        label: linkLabels.managementChilds.subtasks,
        routerLink: [`/${urlFragments.management}`, urlFragments.managementChilds.subtasks]
      },
      {
        label: subtaskLabel
      }
    ]);
  }

  private setForm(subtask?: Subtask) {
    if (subtask) {
      const subtaskDetails = this.subtaskDetailsService.castDtoToFormModel(subtask, this.tags);
      this.form = this.subtaskDetailsService.generateFormGroup(subtaskDetails);
    } else {
      this.form = this.subtaskDetailsService.generateFormGroup();
    }

    this.form.valueChanges.subscribe(() => console.log(this.form));
  }

  private loadAndSetTags(): Observable<Tag[]> {
    return this.tagService.getAllTags().pipe(tap(tags => (this.tags = tags)));
  }
}

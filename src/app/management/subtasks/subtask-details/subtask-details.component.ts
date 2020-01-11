import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { linkLabels } from '../../../core/constants/link-labels';
import { urlFragments } from '../../../core/constants/url-fragments';

import { Subtask } from '../../../core/interfaces/subtask/subtask.interface';
import { Tag } from '../../../core/interfaces/tag/tag.interface';
import { SubtaskModel } from './subtask-model.interface';

import { TagService } from '../../../core/services/tag/tag.service';
import { SubtaskService } from '../../../core/services/subtask/subtask.service';
import { BreadcrumbService } from '../../../core/services/breadcrumb/breadcrumb.service';
import { ModalAlertService } from '../../../core/services/modal-alert/modal-alert.service';
import { SubtaskDetailsPageService } from './subtask-details-page.service';

export const idOfNewSubtask = 'new-subtask';

export const labelOfNewSubtask = 'New Subtask';

export const ALERT_TAG = 'subtask-details';

export const ALERT_MESSAGE = 'The subtask has been saved successfully.';

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
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private tagService: TagService,
    private subtaskService: SubtaskService,
    private breadcrumbService: BreadcrumbService,
    private modalAlertService: ModalAlertService,
    private subtaskDetailsService: SubtaskDetailsPageService
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
      const formRawValue = this.form.getRawValue() as SubtaskModel;

      let action: Observable<any>;

      if (this.subtask) {
        const dto = this.subtaskDetailsService.overrideDtoByFormModel(this.subtask, formRawValue);
        action = this.subtaskService.updateSubtask(dto);
      } else {
        const dto = this.subtaskDetailsService.castFormModelToDto(formRawValue);
        action = this.subtaskService.addSubtask(dto);
      }

      this.subs.push(
        action.subscribe(() => {
          const callbacks = {
            close: () => {
              this.location.back();
            }
          };

          this.modalAlertService.createAndShowAlertModal(ALERT_TAG, ALERT_MESSAGE, callbacks);
        })
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

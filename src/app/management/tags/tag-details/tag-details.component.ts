import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

import { linkLabels } from '../../../core/constants/link-labels';
import { urlFragments } from '../../../core/constants/url-fragments';

import { Tag } from '../../../core/interfaces/tag/tag.interface';
import { TagModel } from './tag-model.interface';

import { TagService } from '../../../core/services/tag/tag.service';
import { BreadcrumbService } from '../../../core/services/breadcrumb/breadcrumb.service';
import { ModalAlertService } from '../../../core/services/modal-alert/modal-alert.service';
import { TagDetailsPageService } from './tag-details-page.service';

export const idOfNewTag = 'new-tag';

export const labelOfNewTag = 'New Tag';

export const ALERT_TAG = 'tag-details';

export const ALERT_MESSAGE = 'The tag has been saved successfully.';

@Component({
  selector: 'rtg-tag-details',
  templateUrl: './tag-details.component.html'
})
export class TagDetailsComponent implements OnInit, OnDestroy {
  form: FormGroup;

  currentEntity: Tag;

  get formTitle(): AbstractControl {
    return this.form.get('title');
  }

  get formDescription(): AbstractControl {
    return this.form.get('description');
  }

  private subs: Subscription[] = [];

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private tagService: TagService,
    private modalAlertService: ModalAlertService,
    private breadcrumbService: BreadcrumbService,
    private tagDetailsService: TagDetailsPageService
  ) {}

  ngOnInit() {
    this.subs.push(this.activatedRoute.params.subscribe(params => this.routeParamsHandler(params)));
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  routeParamsHandler(params: Params) {
    const isNew = params.id === idOfNewTag;

    if (isNew) {
      this.setBreadcrumb(labelOfNewTag);
      this.setForm();
    } else {
      this.subs.push(
        this.tagService.getTagById(+params.id).subscribe(tag => {
          this.currentEntity = tag;

          this.setBreadcrumb(tag.name);
          this.setForm(tag);
        })
      );
    }
  }

  formSubmitHandler() {
    if (this.form.valid) {
      const formRawValue = this.form.getRawValue() as TagModel;

      let action: Observable<any>;

      if (this.currentEntity) {
        const dto = this.tagDetailsService.overrideDtoByFormModel(this.currentEntity, formRawValue);
        action = this.tagService.updateTag(dto);
      } else {
        const dto = this.tagDetailsService.castFormModelToDto(formRawValue);
        action = this.tagService.addTag(dto);
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

  private setBreadcrumb(tagLabel: string) {
    this.breadcrumbService.setItems([
      {
        label: linkLabels.management,
        routerLink: [`/${urlFragments.management}`]
      },
      {
        label: linkLabels.managementChilds.tags,
        routerLink: [`/${urlFragments.management}`, urlFragments.managementChilds.tags]
      },
      {
        label: tagLabel
      }
    ]);
  }

  private setForm(tag?: Tag) {
    if (tag) {
      const tagDetails = this.tagDetailsService.castDtoToFormModel(tag);
      this.form = this.tagDetailsService.generateFormGroup(tagDetails);
    } else {
      this.form = this.tagDetailsService.generateFormGroup();
    }
  }
}

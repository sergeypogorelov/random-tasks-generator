import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

import { linkLabels } from '../../../core/constants/link-labels';
import { urlFragments } from '../../../core/constants/url-fragments';

import { TagDetails } from './tag-details.interface';

import { TagService } from '../../../core/services/tag/tag.service';
import { BreadcrumbService } from '../../../core/services/breadcrumb/breadcrumb.service';
import { TagDetailsService } from './tag-details.service';
import { Tag } from 'src/app/core/interfaces/tag/tag.interface';

export const idOfNewTag = 'new';

export const labelOfNewTag = 'New';

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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tagService: TagService,
    private breadcrumbService: BreadcrumbService,
    private tagDetailsService: TagDetailsService
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
        this.tagService.getById(+params.id).subscribe(tag => {
          this.currentEntity = tag;

          this.setBreadcrumb(tag.name);
          this.setForm(tag);
        })
      );
    }
  }

  formSubmitHandler() {
    if (this.form.valid) {
      const formRawValue = this.form.getRawValue() as TagDetails;

      let action: Observable<any>;

      if (this.currentEntity) {
        const dto = this.tagDetailsService.overrideDtoByFormModel(this.currentEntity, formRawValue);
        action = this.tagService.update(dto);
      } else {
        const dto = this.tagDetailsService.castFormModelToDto(formRawValue);
        action = this.tagService.add(dto);
      }

      this.subs.push(
        action.subscribe(() =>
          this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.tags])
        )
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { linkLabels } from '../../../core/constants/link-labels';
import { urlFragments } from '../../../core/constants/url-fragments';

import { TagService } from '../../../core/services/tag/tag.service';
import { BreadcrumbService } from '../../../core/services/breadcrumb/breadcrumb.service';
import { TagDetailsService } from './tag-details.service';
import { TagDetails } from './tag-details.interface';

export const idOfNewTag = 'new';

export const labelOfNewTag = 'New';

@Component({
  selector: 'rtg-tag-details',
  templateUrl: './tag-details.component.html'
})
export class TagDetailsComponent implements OnInit, OnDestroy {
  form: FormGroup;

  get formTitle(): AbstractControl {
    return this.form.get('title');
  }

  get formDescription(): AbstractControl {
    return this.form.get('title');
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
    this.setBreadcrumb(params);
    this.setForm();
  }

  formSubmitHandler() {
    if (this.form.valid) {
      const formRawValue = this.form.getRawValue() as TagDetails;
      const dto = this.tagDetailsService.castFormModelToDto(formRawValue);

      this.subs.push(
        this.tagService
          .add(dto)
          .subscribe(() => this.router.navigate([`/${urlFragments.management}`, urlFragments.managementChilds.tags]))
      );
    }
  }

  private setBreadcrumb(params: Params) {
    const tagLabel = params.id === idOfNewTag ? labelOfNewTag : params.id;

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

  private setForm() {
    this.form = this.tagDetailsService.generateFormGroup();
  }
}

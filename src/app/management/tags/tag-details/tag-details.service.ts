import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { TagDetails } from './tag-details.interface';
import { TagShort } from '../../../core/interfaces/tag/tag-short.interface';

import { tagNameUnusedValidator } from './tag-name-unused.validator';
import { TagService } from 'src/app/core/services/tag/tag.service';

@Injectable()
export class TagDetailsService {
  constructor(private fb: FormBuilder, private tagService: TagService) {}

  castFormModelToDto(tagDetails: TagDetails): TagShort {
    if (!tagDetails) {
      throw new Error('Tag details are not specified.');
    }

    return {
      name: tagDetails.title,
      description: tagDetails.description
    };
  }

  generateFormGroup(tagDetails: TagDetails = null): FormGroup {
    let formValue = this.generateDefaultFormValue();

    if (tagDetails) {
      formValue = {
        ...formValue,
        ...tagDetails
      };
    }

    return this.fb.group({
      title: [
        formValue.title,
        {
          updateOn: 'blur',
          validators: [Validators.required],
          asyncValidators: [tagNameUnusedValidator(this.tagService)]
        }
      ],
      description: [formValue.description]
    });
  }

  generateDefaultFormValue(): TagDetails {
    return {
      title: '',
      description: ''
    };
  }
}

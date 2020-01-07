import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TagModel } from './tag-model.interface';
import { Tag } from '../../../core/interfaces/tag/tag.interface';

import { Utils } from '../../../core/helpers/utils.class';

import { nameUnusedValidator } from '../../../core/validators/name-unused/name-unused.validator';
import { TagService } from '../../../core/services/tag/tag.service';

@Injectable()
export class TagDetailsPageService {
  constructor(private fb: FormBuilder, private tagService: TagService) {}

  castDtoToFormModel(tag: Tag): TagModel {
    if (!tag) {
      throw new Error('Tag is not specified.');
    }

    return {
      title: tag.name,
      description: tag.description
    };
  }

  castFormModelToDto(tagDetails: TagModel): Tag {
    if (!tagDetails) {
      throw new Error('Tag details are not specified.');
    }

    return {
      name: tagDetails.title,
      description: tagDetails.description
    };
  }

  overrideDtoByFormModel(tag: Tag, tagDetails: TagModel): Tag {
    if (!tag) {
      throw new Error('Tag is not specified.');
    }

    if (!tagDetails) {
      throw new Error('Tag details are not specified.');
    }

    const result = Utils.jsonCopy(tag);

    result.name = tagDetails.title;
    result.description = tagDetails.description;

    return result;
  }

  generateFormGroup(tagDetails: TagModel = null): FormGroup {
    let formValue = this.generateDefaultFormValue();

    if (tagDetails) {
      formValue = {
        ...formValue,
        ...tagDetails
      };
    }

    let originTagName: string = null;
    if (tagDetails) {
      originTagName = tagDetails.title;
    }

    return this.fb.group({
      title: [
        formValue.title,
        {
          updateOn: 'blur',
          validators: [Validators.required],
          asyncValidators: [nameUnusedValidator(this.tagService, originTagName)]
        }
      ],
      description: [formValue.description]
    });
  }

  generateDefaultFormValue(): TagModel {
    return {
      title: '',
      description: ''
    };
  }
}

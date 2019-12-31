import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Tag } from '../../../core/interfaces/tag/tag.interface';
import { Subtask } from '../../../core/interfaces/subtask/subtask.interface';
import { SubtaskDetails } from './subtask-details.interface';

import { nameUnusedValidator } from '../../../core/validators/name-unused/name-unused.validator';
import { arrayNotEmptyValidator } from '../../../core/validators/array-not-empty/array-not-empty.validator';

import { SubtaskService } from '../../../core/services/subtask/subtask.service';

@Injectable()
export class SubtaskDetailsService {
  constructor(private fb: FormBuilder, private subtaskService: SubtaskService) {}

  castDtoToFormModel(subtask: Subtask, allTags: Tag[]): SubtaskDetails {
    if (!subtask) {
      throw new Error('Subtask is not specified.');
    }

    return {
      title: subtask.name,
      description: subtask.description,
      thumbnail: subtask.thumbnail,
      lowProbabilityScore: `${subtask.lowProbabilityScore}`,
      averageProbabilityScore: `${subtask.averageProbabilityScore}`,
      highProbabilityScore: `${subtask.highProbabilityScore}`,
      tags: subtask.tagIds.map(id => allTags.find(i => i.id === id))
    };
  }

  castFormModelToDto(subtaskDetails: SubtaskDetails): Subtask {
    if (!subtaskDetails) {
      throw new Error('Subtask details are not specified.');
    }

    return {
      name: subtaskDetails.title,
      description: subtaskDetails.description,
      thumbnail: subtaskDetails.thumbnail,
      lowProbabilityScore: +subtaskDetails.lowProbabilityScore,
      averageProbabilityScore: +subtaskDetails.averageProbabilityScore,
      highProbabilityScore: +subtaskDetails.highProbabilityScore,
      tagIds: subtaskDetails.tags.map(i => i.id)
    };
  }

  overrideDtoByFormModel(subtask: Subtask, subtaskDetails: SubtaskDetails): Subtask {
    if (!subtask) {
      throw new Error('Subtask is not specified.');
    }

    if (!subtaskDetails) {
      throw new Error('Subtask details are not specified.');
    }

    const result = {
      ...subtask
    };

    result.name = subtaskDetails.title;
    result.description = subtaskDetails.description;
    result.thumbnail = subtaskDetails.thumbnail;
    result.lowProbabilityScore = +subtaskDetails.lowProbabilityScore;
    result.averageProbabilityScore = +subtaskDetails.averageProbabilityScore;
    result.highProbabilityScore = +subtaskDetails.highProbabilityScore;
    result.tagIds = subtaskDetails.tags.map(i => i.id);

    return result;
  }

  generateFormGroup(subtaskDetails: SubtaskDetails = null): FormGroup {
    let formValue = this.generateDefaultFormValue();

    if (subtaskDetails) {
      formValue = {
        ...formValue,
        ...subtaskDetails
      };
    }

    let originSubtaskName: string = null;
    if (subtaskDetails) {
      originSubtaskName = subtaskDetails.title;
    }

    return this.fb.group({
      title: [
        formValue.title,
        {
          updateOn: 'blur',
          validators: [Validators.required],
          asyncValidators: [nameUnusedValidator(this.subtaskService, originSubtaskName)]
        }
      ],
      description: [formValue.description],
      thumbnail: [formValue.thumbnail, [Validators.required]],
      lowProbabilityScore: [formValue.lowProbabilityScore, [Validators.required, Validators.min(1)]],
      averageProbabilityScore: [formValue.averageProbabilityScore, [Validators.required, Validators.min(1)]],
      highProbabilityScore: [formValue.highProbabilityScore, [Validators.required, Validators.min(1)]],
      tags: [formValue.tags, [arrayNotEmptyValidator()]]
    });
  }

  generateDefaultFormValue(): SubtaskDetails {
    return {
      title: '',
      description: '',
      thumbnail: null,
      lowProbabilityScore: '',
      averageProbabilityScore: '',
      highProbabilityScore: '',
      tags: []
    };
  }
}

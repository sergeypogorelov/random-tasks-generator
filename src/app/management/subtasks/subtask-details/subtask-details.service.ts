import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Utils } from 'src/app/core/helpers/utils.class';
import { SubtaskService } from 'src/app/core/services/subtask/subtask.service';
import { Subtask } from 'src/app/core/interfaces/subtask/subtask.interface';
import { SubtaskDetails } from './subtask-details.interface';
import { SubtaskShort } from 'src/app/core/interfaces/subtask/subtask-short.interface';
import { nameUnusedValidator } from 'src/app/shared/validators/name-unused/name-unused.validator';
import { arrayNotEmptyValidator } from 'src/app/shared/validators/array-not-empty/array-not-empty.validator';

@Injectable()
export class SubtaskDetailsService {
  constructor(private fb: FormBuilder, private subtaskService: SubtaskService) {}

  castDtoToFormModel(subtask: Subtask, tagNames: string[]): SubtaskDetails {
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
      tagNames
    };
  }

  castFormModelToDto(subtaskDetails: SubtaskDetails, tagIds: number[]): SubtaskShort {
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
      tagIds
    };
  }

  overrideDtoByFormModel(subtask: Subtask, subtaskDetails: SubtaskDetails, tagIds: number[]): Subtask {
    if (!subtask) {
      throw new Error('Subtask is not specified.');
    }

    if (!subtaskDetails) {
      throw new Error('Subtask details are not specified.');
    }

    const result = Utils.jsonCopy(subtask);

    result.name = subtaskDetails.title;
    result.description = subtaskDetails.description;
    result.thumbnail = subtaskDetails.thumbnail;
    result.lowProbabilityScore = +subtaskDetails.lowProbabilityScore;
    result.averageProbabilityScore = +subtaskDetails.averageProbabilityScore;
    result.highProbabilityScore = +subtaskDetails.highProbabilityScore;
    result.tagIds = tagIds;

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
      tagNames: [formValue.tagNames, [arrayNotEmptyValidator()]]
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
      tagNames: []
    };
  }
}

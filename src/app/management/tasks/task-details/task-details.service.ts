import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Tag } from '../../../core/interfaces/tag/tag.interface';
import { Task } from '../../../core/interfaces/task/task.interface';
import { TaskDetails } from './task-details.interface';

import { nameUnusedValidator } from '../../../shared/validators/name-unused/name-unused.validator';
import { arrayNotEmptyValidator } from '../../../shared/validators/array-not-empty/array-not-empty.validator';
import { TaskService } from '../../../core/services/task/task.service';

@Injectable()
export class TaskDetailsService {
  constructor(private fb: FormBuilder, private taskService: TaskService) {}

  castDtoToFormModel(subtask: Task, allTags: Tag[]): TaskDetails {
    if (!subtask) {
      throw new Error('Task is not specified.');
    }

    return {
      title: subtask.name,
      description: subtask.description,
      thumbnail: subtask.thumbnail,
      tags: subtask.tagIds.map(id => allTags.find(i => i.id === id))
    };
  }

  castFormModelToDto(subtaskDetails: TaskDetails): Task {
    if (!subtaskDetails) {
      throw new Error('Task details are not specified.');
    }

    return {
      name: subtaskDetails.title,
      description: subtaskDetails.description,
      thumbnail: subtaskDetails.thumbnail,
      tagIds: subtaskDetails.tags.map(i => i.id)
    };
  }

  overrideDtoByFormModel(subtask: Task, subtaskDetails: TaskDetails): Task {
    if (!subtask) {
      throw new Error('Task is not specified.');
    }

    if (!subtaskDetails) {
      throw new Error('Task details are not specified.');
    }

    const result = {
      ...subtask
    };

    result.name = subtaskDetails.title;
    result.description = subtaskDetails.description;
    result.thumbnail = subtaskDetails.thumbnail;
    result.tagIds = subtaskDetails.tags.map(i => i.id);

    return result;
  }

  generateFormGroup(subtaskDetails: TaskDetails = null): FormGroup {
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
          asyncValidators: [nameUnusedValidator(this.taskService, originSubtaskName)]
        }
      ],
      description: [formValue.description],
      thumbnail: [formValue.thumbnail, [Validators.required]],
      tags: [formValue.tags, [arrayNotEmptyValidator()]]
    });
  }

  generateDefaultFormValue(): TaskDetails {
    return {
      title: '',
      description: '',
      thumbnail: null,
      tags: []
    };
  }
}

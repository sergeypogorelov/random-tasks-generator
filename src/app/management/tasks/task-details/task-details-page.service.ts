import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Tag } from '../../../core/interfaces/tag/tag.interface';
import { Task } from '../../../core/interfaces/task/task.interface';
import { TaskModel } from './task-model.interface';

import { nameUnusedValidator } from '../../../core/validators/name-unused/name-unused.validator';
import { arrayNotEmptyValidator } from '../../../core/validators/array-not-empty/array-not-empty.validator';
import { TaskService } from '../../../core/services/task/task.service';

@Injectable()
export class TaskDetailsPageService {
  constructor(private fb: FormBuilder, private taskService: TaskService) {}

  castDtoToFormModel(task: Task, allTags: Tag[]): TaskModel {
    if (!task) {
      throw new Error('Task is not specified.');
    }

    return {
      title: task.name,
      description: task.description,
      thumbnail: task.thumbnail,
      minCount: `${task.minCount}`,
      maxCount: `${task.maxCount}`,
      tags: task.tagIds.map(id => allTags.find(i => i.id === id))
    };
  }

  castFormModelToDto(taskDetails: TaskModel): Task {
    if (!taskDetails) {
      throw new Error('Task details are not specified.');
    }

    return {
      name: taskDetails.title,
      description: taskDetails.description,
      thumbnail: taskDetails.thumbnail,
      minCount: +taskDetails.minCount,
      maxCount: +taskDetails.maxCount,
      tagIds: taskDetails.tags.map(i => i.id)
    };
  }

  overrideDtoByFormModel(task: Task, taskDetails: TaskModel): Task {
    if (!task) {
      throw new Error('Task is not specified.');
    }

    if (!taskDetails) {
      throw new Error('Task details are not specified.');
    }

    const result = {
      ...task
    };

    result.name = taskDetails.title;
    result.description = taskDetails.description;
    result.thumbnail = taskDetails.thumbnail;
    result.minCount = +taskDetails.minCount;
    result.maxCount = +taskDetails.maxCount;
    result.tagIds = taskDetails.tags.map(i => i.id);

    return result;
  }

  generateFormGroup(taskDetails: TaskModel = null): FormGroup {
    let formValue = this.generateDefaultFormValue();

    if (taskDetails) {
      formValue = {
        ...formValue,
        ...taskDetails
      };
    }

    let originTaskName: string = null;
    if (taskDetails) {
      originTaskName = taskDetails.title;
    }

    return this.fb.group({
      title: [
        formValue.title,
        {
          updateOn: 'blur',
          validators: [Validators.required],
          asyncValidators: [nameUnusedValidator(this.taskService, originTaskName)]
        }
      ],
      description: [formValue.description],
      thumbnail: [formValue.thumbnail, [Validators.required]],
      minCount: [formValue.minCount, [Validators.required, Validators.min(1)]],
      maxCount: [formValue.maxCount, [Validators.required, Validators.min(1)]],
      tags: [formValue.tags, [arrayNotEmptyValidator()]]
    });
  }

  generateDefaultFormValue(): TaskModel {
    return {
      title: '',
      description: '',
      thumbnail: null,
      minCount: '1',
      maxCount: '1',
      tags: []
    };
  }
}

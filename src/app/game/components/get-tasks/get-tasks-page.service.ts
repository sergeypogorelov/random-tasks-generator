import { Injectable } from '@angular/core';
import { Task } from '../../../core/interfaces/task/task.interface';
import { Subtask } from '../../../core/interfaces/subtask/subtask.interface';
import { TaskModel } from './interfaces/task-model.interface';
import { SubtaskModel } from './interfaces/subtask-model.interface';

import { ObjectUrlService } from 'src/app/core/services/object-url/object-url.service';

const TAG = 'get-tasks-page-service';

@Injectable()
export class GetTasksPageService {
  constructor(private objectUrlService: ObjectUrlService) {}

  castTaskDtoToModel(dto: Task): TaskModel {
    if (!dto) {
      throw new Error('Task DTO is not specified.');
    }

    const imgInfo = this.objectUrlService.createImgUrl(TAG, dto.thumbnail);
    const thumbnailDateUrl = imgInfo.dataUrl;
    const thumbnailSafeUrl = imgInfo.safeUrl;

    const result: TaskModel = {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      thumbnailDateUrl,
      thumbnailSafeUrl
    };

    return result;
  }

  castSubtaskDtoToModel(dto: Subtask): SubtaskModel {
    if (!dto) {
      throw new Error('Subtask DTO is not specified.');
    }

    const imgInfo = this.objectUrlService.createImgUrl(TAG, dto.thumbnail);
    const thumbnailDateUrl = imgInfo.dataUrl;
    const thumbnailSafeUrl = imgInfo.safeUrl;

    const result: SubtaskModel = {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      thumbnailDateUrl,
      thumbnailSafeUrl
    };

    return result;
  }

  revokeImgUrls() {
    this.objectUrlService.revokeUrlsByTag(TAG);
  }
}

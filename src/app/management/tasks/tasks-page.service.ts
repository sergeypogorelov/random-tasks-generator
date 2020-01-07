import { Injectable } from '@angular/core';

import { Tag } from '../../core/interfaces/tag/tag.interface';
import { Task } from '../../core/interfaces/task/task.interface';
import { TaskGridModel } from './task-grid-model.interface';

import { ObjectUrlService } from '../../core/services/object-url/object-url.service';

const DATA_URLS_TAG = 'tasks-page-service';

@Injectable()
export class TasksPageService {
  constructor(private objectUrlService: ObjectUrlService) {}

  castDtoToModel(dto: Task, tags: Tag[]): TaskGridModel {
    if (!dto) {
      throw new Error('Dto is not specified.');
    }

    const { id, name, description, tagIds } = dto;

    const imgInfo = this.objectUrlService.createImgUrl(DATA_URLS_TAG, dto.thumbnail);
    const thumbnailDateUrl = imgInfo.dataUrl;
    const thumbnailSafeUrl = imgInfo.safeUrl;

    const result: TaskGridModel = {
      id,
      name,
      description,
      thumbnailDateUrl,
      thumbnailSafeUrl,
      tags: tagIds.map(tagid => tags.find(tag => tag.id === tagid)).filter(i => i)
    };

    return result;
  }

  revokeImgUrls() {
    this.objectUrlService.revokeUrlsByTag(DATA_URLS_TAG);
  }
}

import { Injectable } from '@angular/core';

import { Task } from '../../core/interfaces/task/task.interface';
import { Person } from '../../core/interfaces/person/person.interface';
import { PersonsGridModel } from './persons-grid-model.interface';

import { ObjectUrlService } from '../../core/services/object-url/object-url.service';

const TAG = 'persons-page-service';

@Injectable()
export class PersonsPageService {
  constructor(private objectUrlService: ObjectUrlService) {}

  castDtoToModel(dto: Person, tasks: Task[]): PersonsGridModel {
    if (!dto) {
      throw new Error('Dto is not specified.');
    }

    const { id, name, description } = dto;

    const taskIds: number[] = [];
    dto.iterations.forEach(iteration => {
      iteration.tasks.forEach(task => {
        if (!taskIds.includes(task.taskId)) {
          taskIds.push(task.taskId);
        }
      });
    });

    const imgInfo = this.objectUrlService.createImgUrl(TAG, dto.thumbnail);
    const thumbnailDateUrl = imgInfo.dataUrl;
    const thumbnailSafeUrl = imgInfo.safeUrl;

    const result: PersonsGridModel = {
      id,
      name,
      description,
      thumbnailDateUrl,
      thumbnailSafeUrl,
      tasks: taskIds.map(taskId => tasks.find(task => task.id === taskId)).filter(i => i)
    };

    return result;
  }

  revokeImgUrls() {
    this.objectUrlService.revokeUrlsByTag(TAG);
  }
}

import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Task } from '../../core/interfaces/task/task.interface';
import { Person } from '../../core/interfaces/person/person.interface';
import { PersonsGridModel } from './persons-grid-model.interface';

import { FileReaderHelper } from '../../core/helpers/filer-reader/file-reader-helper.class';

@Injectable()
export class PersonsPageService {
  constructor(private domSanitizer: DomSanitizer) {}

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

    const thumbnailDateUrl = FileReaderHelper.arrayBufferToDataUrl(dto.thumbnail.arrayBuffer, dto.thumbnail.type);
    const thumbnailSafeUrl = this.domSanitizer.bypassSecurityTrustUrl(thumbnailDateUrl);

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
}

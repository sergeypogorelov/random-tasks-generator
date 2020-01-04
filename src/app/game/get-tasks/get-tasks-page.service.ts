import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Task } from '../../core/interfaces/task/task.interface';
import { Subtask } from '../../core/interfaces/subtask/subtask.interface';
import { TaskModel } from './task-model.interface';
import { SubtaskModel } from './subtask-model.interface';

import { FileReaderHelper } from '../../core/helpers/filer-reader/file-reader-helper.class';

@Injectable()
export class GetTasksPageService {
  constructor(private domSanitizer: DomSanitizer) {}

  castTaskDtoToModel(dto: Task): TaskModel {
    if (!dto) {
      throw new Error('Task DTO is not specified.');
    }

    const thumbnailDateUrl = FileReaderHelper.arrayBufferToDataUrl(dto.thumbnail.arrayBuffer, dto.thumbnail.type);
    const thumbnailSafeUrl = this.domSanitizer.bypassSecurityTrustUrl(thumbnailDateUrl);

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

    const thumbnailDateUrl = FileReaderHelper.arrayBufferToDataUrl(dto.thumbnail.arrayBuffer, dto.thumbnail.type);
    const thumbnailSafeUrl = this.domSanitizer.bypassSecurityTrustUrl(thumbnailDateUrl);

    const result: SubtaskModel = {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      thumbnailDateUrl,
      thumbnailSafeUrl
    };

    return result;
  }
}

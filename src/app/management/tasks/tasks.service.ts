import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Tag } from '../../core/interfaces/tag/tag.interface';
import { Task } from '../../core/interfaces/task/task.interface';
import { TaskModel } from './task-model.interface';

import { FileReaderHelper } from '../../core/helpers/filer-reader/file-reader-helper.class';

@Injectable()
export class TasksService {
  constructor(private domSanitizer: DomSanitizer) {}

  castDtoToModel(dto: Task, tags: Tag[]): TaskModel {
    if (!dto) {
      throw new Error('Dto is not specified.');
    }

    const { id, name, description, tagIds } = dto;

    const thumbnailDateUrl = FileReaderHelper.arrayBufferToDataUrl(dto.thumbnail.arrayBuffer, dto.thumbnail.type);
    const thumbnailSafeUrl = this.domSanitizer.bypassSecurityTrustUrl(thumbnailDateUrl);

    const result: TaskModel = {
      id,
      name,
      description,
      thumbnailDateUrl,
      thumbnailSafeUrl,
      tags: tagIds.map(tagid => tags.find(tag => tag.id === tagid)).filter(i => i)
    };

    return result;
  }
}
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TagService } from 'src/app/core/services/tag/tag.service';
import { Task } from 'src/app/core/interfaces/task/task.interface';
import { TaskModel } from './task-model.interface';
import { Observable } from 'rxjs';
import { FileReaderHelper } from 'src/app/core/helpers/filer-reader/file-reader-helper.class';
import { Tag } from 'src/app/core/interfaces/tag/tag.interface';

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

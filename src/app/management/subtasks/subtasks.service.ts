import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { Subtask } from '../../core/interfaces/subtask/subtask.interface';
import { SubtaskModel } from './subtask-model.interface';

import { FileReaderHelper } from '../../core/helpers/filer-reader/file-reader-helper.class';

import { TagService } from '../../core/services/tag/tag.service';

@Injectable()
export class SubtasksService {
  constructor(private domSanitizer: DomSanitizer, private tagService: TagService) {}

  castDtoToModel(dto: Subtask): Observable<SubtaskModel> {
    if (!dto) {
      throw new Error('Dto is not specified.');
    }

    const { id, name, description, lowProbabilityScore, averageProbabilityScore, highProbabilityScore } = dto;

    return forkJoin(dto.tagIds.map(tagId => this.tagService.getTagById(tagId))).pipe(
      map(tags => {
        const thumbnailDateUrl = FileReaderHelper.arrayBufferToDataUrl(dto.thumbnail.arrayBuffer, dto.thumbnail.type);
        const thumbnailSafeUrl = this.domSanitizer.bypassSecurityTrustUrl(thumbnailDateUrl);

        const result: SubtaskModel = {
          id,
          name,
          description,
          thumbnailDateUrl,
          thumbnailSafeUrl,
          lowProbabilityScore,
          averageProbabilityScore,
          highProbabilityScore,
          tags
        };

        return result;
      })
    );
  }
}

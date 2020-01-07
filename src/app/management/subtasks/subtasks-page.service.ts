import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { Subtask } from '../../core/interfaces/subtask/subtask.interface';
import { SubtaskGridModel } from './subtask-grid-model.interface';

import { TagService } from '../../core/services/tag/tag.service';
import { ObjectUrlService } from '../../core/services/object-url/object-url.service';

const TAG = 'subtask-page-service';

@Injectable()
export class SubtasksPageService {
  constructor(private tagService: TagService, private objectUrlService: ObjectUrlService) {}

  castDtoToModel(dto: Subtask): Observable<SubtaskGridModel> {
    if (!dto) {
      throw new Error('Dto is not specified.');
    }

    const { id, name, description, lowProbabilityScore, averageProbabilityScore, highProbabilityScore } = dto;

    return forkJoin(dto.tagIds.map(tagId => this.tagService.getTagById(tagId))).pipe(
      map(tags => {
        const imgInfo = this.objectUrlService.createImgUrl(TAG, dto.thumbnail);
        const thumbnailDateUrl = imgInfo.dataUrl;
        const thumbnailSafeUrl = imgInfo.safeUrl;

        const result: SubtaskGridModel = {
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

  revokeImgUrls() {
    this.objectUrlService.revokeUrlsByTag(TAG);
  }
}

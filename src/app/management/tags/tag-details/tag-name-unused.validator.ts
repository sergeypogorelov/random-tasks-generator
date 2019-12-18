import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { TagService } from '../../../core/services/tag/tag.service';

export function tagNameUnusedValidator(tagService: TagService, originTagName: string = null) {
  if (!tagService) {
    throw new Error('Tag Service is not specified.');
  }

  return (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
    return tagService.checkIfNameUnused(ctrl.value, originTagName).pipe(
      map(notUsed => (notUsed ? null : { nameExists: true })),
      catchError(() => null)
    );
  };
}

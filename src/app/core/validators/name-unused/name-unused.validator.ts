import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { NameUnusedService } from './name-unused-service.interface';

export function nameUnusedValidator(service: NameUnusedService, originTagName: string = null) {
  if (!service) {
    throw new Error('Tag Service is not specified.');
  }

  return (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
    return service
      .checkIfNameUnused(ctrl.value, originTagName)
      .pipe(map(notUsed => (notUsed ? null : { nameExists: true })));
  };
}

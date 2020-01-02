import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NameUnusedService } from './name-unused-service.interface';

export function nameUnusedValidator(service: NameUnusedService, originName: string = null) {
  if (!service) {
    throw new Error('Tag Service is not specified.');
  }

  return (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
    return service
      .checkIfNameUnused(ctrl.value, originName)
      .pipe(map(notUsed => (notUsed ? null : { nameExists: true })));
  };
}

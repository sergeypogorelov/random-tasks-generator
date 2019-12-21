import { AbstractControl, ValidationErrors } from '@angular/forms';

export function arrayNotEmptyValidator() {
  return (ctrl: AbstractControl): ValidationErrors => {
    const value = ctrl.value as any[];

    if (!value) {
      return null;
    }

    return value.length === 0 ? { arrayNotEmpty: true } : null;
  };
}

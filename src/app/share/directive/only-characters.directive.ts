import {AbstractControl, ValidatorFn} from '@angular/forms';

export function onlyCharacterValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let data = control.value;
    if (data) {
      data = data.trim();
    }
    const number = !nameRe.test(data);
    if (!control.value) {
      return null;
    }
    return number ? {'onlyCharacter': {value: control.value}} : null;
  };
}
export function onlyNaturalNumber(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let data = control.value;
    if (data) {
      data = data.trim();
    }
    const nameRe: RegExp = /^[1-9][0-9]*$/;
    const number = !nameRe.test(data);
    if (!control.value) {
      return null;
    }
    return number ? {'onlyNaturalNumber': {value: control.value}} : null;
  };
}

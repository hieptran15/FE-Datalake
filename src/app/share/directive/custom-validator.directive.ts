import {AbstractControl, ValidatorFn} from '@angular/forms';
import validateColor from './validate-color';

export class CustomValidators {


  static isValidColor(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      const s = new Option().style;
      const color = control.value.trim();
      s.color = control.value.trim();
      const test1 = s.color === color;
      if (test1 === true || validateColor(color)) {
        return null;
      }
      return {'isValidColor': {value: control.value}};
    };
  }

}



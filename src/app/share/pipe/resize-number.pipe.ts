import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'resizeNumber'
})
export class ResizeNumberPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    // console.log(value);
    const output = value.toString();
    if (output.length > 4) return output.substring(0, 3) + '...'
    else
      return output;
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datatablePipe'
})
export class DatatablePipe implements PipeTransform {
  transform(list: any[], filterText: string[]): any {
    const result = [];
    filterText.forEach(txt => {
      result.push(list.filter(x => x.value.includes(txt)));
    });
    return result.reduce((acc, val) => acc.concat(val), []);
  }
}

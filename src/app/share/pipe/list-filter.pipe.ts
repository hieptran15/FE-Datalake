import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listFilter'
})
export class ListFilterPipe implements PipeTransform {
  transform(list: any[], filterText: string, terms: string[]): any {
    if (!filterText || filterText.toString().trim() === '' || !terms || terms.length === 0) {
      return list;
    }

    return list
      ? list.filter(item => {
          return terms.some(k =>
            item[k]
              .trim()
              .toLowerCase()
              .includes(filterText.trim().toLowerCase())
          );
        })
      : [];
  }
}

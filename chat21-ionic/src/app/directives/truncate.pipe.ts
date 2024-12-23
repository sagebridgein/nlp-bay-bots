import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, character: number): any {
    if(value && value.length > character) 
      return value.substring(0, character) + ' ...'
    else 
      return value;
  }

}

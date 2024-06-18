import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hourminsecpipe'
})
export class HourminsecPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const hours: number = Math.floor(value / (60*60));
    const minutes: number = Math.floor((value-(hours*60*60)) / 60);
    const second: number = Math.floor((value-(hours*60*60)-(minutes*60)));
    return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':'
    + second.toString().padStart(2, '0');
  }

}

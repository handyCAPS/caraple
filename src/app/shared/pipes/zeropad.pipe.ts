import { Pipe, PipeTransform } from '@angular/core';
import { zeroPad } from '../helpers/helpers';

@Pipe({
  name: 'zeropad',
  standalone: true
})
export class ZeropadPipe implements PipeTransform {

  transform(value: string | number, length: number = 2): string {
    return zeroPad(value, length);
  }

}

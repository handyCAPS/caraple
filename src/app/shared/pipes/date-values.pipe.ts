import { Pipe, PipeTransform } from '@angular/core';
import { msToValues, zeroPad } from '../helpers/helpers';

@Pipe({
  name: 'dateValues',
  standalone: true,
})
export class DateValuesPipe implements PipeTransform {
  transform(ms: number): unknown {
    const { milliseconds, seconds, minutes } = msToValues(ms);
    const minutesString = zeroPad(minutes, 2);
    const secondsString = zeroPad(seconds, 2);
    const msString = zeroPad(milliseconds, 3);
    return `${minutesString}:${secondsString}:${msString}`;
  }
}

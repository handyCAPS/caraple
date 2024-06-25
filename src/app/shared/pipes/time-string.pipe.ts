import { Pipe, PipeTransform } from '@angular/core';
import { msToValues, toTimeString, zeroPad } from '../helpers/helpers';

@Pipe({
  name: 'timeString',
  standalone: true,
})
export class TimeStringPipe implements PipeTransform {
  /**
   * Display milliseconds as a timestring
   * @param ms The time to display
   * @param trim Remove minutes or seconds if 0
   * @returns String showing minutes, seconds and milliseconds with : seperator
   */
  transform(ms: number, trim?: boolean): string {
    return toTimeString(ms, trim);
  }
}

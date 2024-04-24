import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique',
  standalone: true,
})
export class UniquePipe implements PipeTransform {
  transform<T>(value: T[]): T[] {
    return [...new Set(value)];
  }
}

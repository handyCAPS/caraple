import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alphabetical',
  standalone: true,
})
export class AlphabeticalPipe implements PipeTransform {
  transform(value: string[]): string[] {
    return value.sort((a, b) => a.localeCompare(b));
  }
}

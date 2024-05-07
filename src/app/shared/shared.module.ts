import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniquePipe } from './pipes/unique.pipe';
import { AlphabeticalPipe } from './pipes/alphabetical.pipe';

@NgModule({
  declarations: [],
  imports: [CommonModule, UniquePipe ,AlphabeticalPipe],
  exports: [],
})
export class SharedModule {}

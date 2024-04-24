import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './components/board/board.component';
import { UniquePipe } from './pipes/unique.pipe';
import { AlphabeticalPipe } from './pipes/alphabetical.pipe';

@NgModule({
  declarations: [BoardComponent],
  imports: [CommonModule, UniquePipe ,AlphabeticalPipe],
  exports: [BoardComponent],
})
export class SharedModule {}

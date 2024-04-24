import { Component } from '@angular/core';

@Component({
  selector: 'app-line',
  standalone: true,
  imports: [],
  templateUrl: './line.component.html',
  styleUrl: './line.component.scss'
})
export class LineComponent {
  public letters: {id: number; letter: string;}[] = [];
}

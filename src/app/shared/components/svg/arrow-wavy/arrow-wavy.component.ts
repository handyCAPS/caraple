import { NgStyle } from '@angular/common';
import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'cpx-arrow-wavy',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './arrow-wavy.component.html',
  styleUrl: './arrow-wavy.component.scss',
})
export class ArrowWavyComponent {
  public styles = input<{ [klass: string]: string | number }>();
}

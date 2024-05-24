import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'cpx-rank-prize',
  standalone: true,
  imports: [NgClass],
  templateUrl: './rank-prize.component.html',
  styleUrl: './rank-prize.component.scss',
})
export class RankPrizeComponent {
  public ranking = input.required<number>();

  public rankingLength = computed(() => this.ranking().toString().length);
}

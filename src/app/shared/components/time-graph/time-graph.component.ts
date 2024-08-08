import { Component, DestroyRef, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { IGame } from '../../interfaces/game.interface';
import { GamesService } from '../../services/games.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { toTimeString } from '../../helpers/helpers';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';

interface IChartPoints
  extends Required<Pick<ChartConfiguration['data'], 'datasets' | 'labels'>> {}

type TChartTimeOption = {
  label: string;
  count: number;
};

@Component({
  selector: 'cpx-time-graph',
  standalone: true,
  imports: [BaseChartDirective, FormsModule, UpperCasePipe],
  templateUrl: './time-graph.component.html',
  styleUrl: './time-graph.component.scss',
})
export class TimeGraphComponent {
  destroyRef = inject(DestroyRef);

  private allGames: IGame[] = [];

  public chartTimeOptions: TChartTimeOption[] = [
    {
      label: 'last',
      count: 50,
    },
    {
      label: 'last',
      count: 200,
    },
    {
      label: 'all',
      count: 0,
    },
  ].map((option) => {
    if (option.count === 0) {
      return option;
    }
    return {
      ...option,
      label: `${option.label} ${option.count}`,
    };
  });

  public defaultChartLength: number = 50;

  private chartLength: number = this.defaultChartLength;

  constructor(private readonly gamesService: GamesService) {
    this.gamesService
      .subtoAllGames(false)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((games) => !!games)
      )
      .subscribe((games) => {
        this.allGames = games!;
        this.chartLength = this.chartLength || games?.length || 0;
        this.setChartData(games!);
      });
  }

  private setChartData(games: IGame[]): void {
    this.lineChartData = {
      ...this.lineChartData,
      ...this.gamesToChartPoints(games, this.chartLength),
    };
    console.log('this.lineChartData', this.lineChartData.datasets[0].data.length);
  }

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
      },
    ],
    labels: [],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value: number = (context.raw as number) ?? 0;
            return toTimeString(value, true);
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value, index, ticks) {
            return toTimeString(+value, true);
          },
        },
      },
    },
  };

  public gamesToChartPoints(
    games: IGame[],
    numberOfGames: number = 20
  ): IChartPoints {
    console.log('numberOfGames', numberOfGames);
    return {
      datasets: [
        {
          data: this.gamesToAverages(games).slice(games.length - numberOfGames),
        },
      ],
      labels: games
        .slice(games.length - numberOfGames)
        .map((game) => game.word.toUpperCase()),
    };
  }

  public gamesToAverages(games: IGame[]): number[] {
    return games.map((game, index) => {
      const gamesSofar = games.slice(0, index + 1);
      return Math.round(
        gamesSofar.reduce((p, c) => p + c.timeSpent, 0) / gamesSofar.length
      );
    });
  }

  public setTimeOption(count: number): void {
    console.log('count', count);
    this.chartLength = count || this.allGames.length;
    this.setChartData(this.allGames);
  }
}

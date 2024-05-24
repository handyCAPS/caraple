import { Component } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { IGame } from '../../interfaces/game.interface';
import { Observable, tap } from 'rxjs';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { DateValuesPipe } from '../../pipes/date-values.pipe';

@Component({
  selector: 'cpx-scoreboard',
  standalone: true,
  imports: [AsyncPipe, DateValuesPipe, UpperCasePipe],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss',
})
export class ScoreboardComponent {
  public games$!: Observable<IGame[] | null>;

  public averageTime: number | null = null;

  public trendingDown: boolean | null = null;

  public added: boolean = false;
  constructor(private readonly gamesService: GamesService) {
    this.games$ = this.gamesService.subToGames().pipe(
      tap((games) => {
        if (games?.length) {
          console.log('this.averageTime', this.averageTime);
          const newAverage = this.gamesService.getAverageTime(
            this.gamesService.getGames()
          );
          if (this.averageTime) {
            this.trendingDown = newAverage < this.averageTime;
          }
          this.averageTime = newAverage;
        }
      })
    );
  }
}

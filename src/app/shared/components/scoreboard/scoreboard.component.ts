import { Component } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { IGame } from '../../interfaces/game.interface';
import { Observable, tap } from 'rxjs';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { TimeStringPipe } from '../../pipes/time-string.pipe';
import { ArrowWavyComponent } from '../svg/arrow-wavy/arrow-wavy.component';

@Component({
  selector: 'cpx-scoreboard',
  standalone: true,
  imports: [AsyncPipe, TimeStringPipe, UpperCasePipe, ArrowWavyComponent],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss',
})
export class ScoreboardComponent {
  public games$!: Observable<IGame[] | null>;

  public averageTime: number | null = null;

  public averageDiff: number | null = null;

  public trendingDown: boolean | null = null;

  public added: boolean = false;

  public arrowStyleBase = {
    width: '2em',
  };

  public arrowStyleUp = {
    ...this.arrowStyleBase,
    color: 'var(--green)',
    transform: 'rotateZ(35deg) rotateX(0deg)',
  };

  public arrowStyleDown = {
    ...this.arrowStyleBase,
    color: 'var(--red)',
    transform: 'rotateZ(-45deg) rotateX(180deg)',
  };

  constructor(private readonly gamesService: GamesService) {
    this.games$ = this.getGames();
    this.gamesService.getStreak().subscribe(result=> {
      console.log('result', result);
    })
  }

  private getGames() : Observable<IGame[] | null> {
    return this.gamesService.subToTopGames().pipe(
      tap((games) => {
        if (games?.length) {
          console.log('this.averageTime', this.averageTime);
          const newAverage = this.gamesService.getAverageTime(
            // Need to get all games here
            this.gamesService.getGames()
          );

          if (this.averageTime) {
            this.trendingDown = newAverage < this.averageTime;
            if (this.trendingDown) {
              this.averageDiff = this.averageTime - newAverage;
            } else {
              this.averageDiff = newAverage - this.averageTime;
            }
          }
          this.averageTime = newAverage;
        }
      })
    );
  }
}

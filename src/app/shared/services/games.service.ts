import { Injectable } from '@angular/core';
import { IGame } from '../interfaces/game.interface';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { mockGames } from '../../testing/mock-data/mock-games';
import { GamesDbService } from './games-db.service';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  private games: IGame[] | null = null;

  private gamesSub = new BehaviorSubject<IGame[] | null>(this.games);
  private gettingGame: boolean = false;

  private gameSub = new Subject<boolean>();

  public readonly highScoreSize: number = 10;

  constructor(private readonly gamesDbService: GamesDbService) {}

  public addGame(game: IGame): void {
    if (!this.games) {
      this.games = [];
    }
    this.gamesDbService.addGame(game).subscribe((gameWithId) => {
      this.games!.push(gameWithId);
      this.gamesSub.next(this.games);
    });
  }

  public getGames(): IGame[] {
    return this.games || [];
  }

  public afterGame(): Observable<boolean> {
    return this.gameSub.asObservable();
  }

  public setAfterGame(correct: boolean): void {
    this.gameSub.next(correct);
  }

  public subToGames(
    topLength: number = this.highScoreSize
  ): Observable<IGame[] | null> {
    if (this.games === null && !this.gettingGame) {
      this.gettingGame = true;
      this.gamesDbService.getGames().subscribe((games) => {
        console.log('games all', games);
        this.games = games;
        this.gamesSub.next(this.games);
      });
    }

    return this.gamesSub
      .asObservable()
      .pipe(
        map((games) =>
          games ? this.getTopGames(topLength || games.length) : null
        )
      );
  }

  public getTopGames(topLength: number, games?: IGame[]): IGame[] {
    const allGames = games ?? this.games ?? [];
    allGames.sort((gameA, gameB) => gameA.timeSpent - gameB.timeSpent);

    return allGames.slice(0, topLength);
  }

  public getAverageTime(games: IGame[]): number {
    const totalTime = games.reduce((prev, curr) => prev + curr.timeSpent, 0);
    return Math.round(totalTime / games.length);
  }

  public getRanking(time: number, games?: IGame[]): number {
    const gamesToRank = games ?? this.games;
    if (!gamesToRank?.length) {
      return 1;
    }
    const sortedGames = this.getTopGames(gamesToRank.length, gamesToRank);
    const gamesThatBeatTime = sortedGames.filter(
      (game) => game.timeSpent <= time
    );
    return gamesThatBeatTime.length + 1;
  }
}

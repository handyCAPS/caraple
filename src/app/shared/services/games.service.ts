import { Injectable } from '@angular/core';
import { IGame } from '../interfaces/game.interface';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { mockGames } from '../../testing/mock-data/mock-games';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  private games: IGame[] | null = mockGames;

  private gameSub = new BehaviorSubject<IGame[] | null>(this.games);

  constructor() {}

  public addGame(game: IGame): void {
    if (!this.games) {
      this.games = [];
    }
    game.id = 'game' + (this.games.length + 1);
    console.log('game adding:', game);
    this.games.push(game);
    this.gameSub.next(this.games);
  }

  public getGames(): IGame[] {
    return this.games || [];
  }

  public subToGames(topLength: number = 0): Observable<IGame[] | null> {
    // if (this.games === null) {
    //   this.games = [];
    // }

    return this.gameSub
      .asObservable()
      .pipe(map((games) => games ? this.getTopGames(topLength || games.length): null));
  }

  public getTopGames(topLength: number): IGame[] {
    const games = this.games || [];
    games.sort((gameA, gameB) => gameA.timeSpent - gameB.timeSpent);

    return games.slice(0, topLength);
  }
}

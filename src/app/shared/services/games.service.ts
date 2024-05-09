import { Injectable } from '@angular/core';
import { IGame } from '../interfaces/game.interface';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { mockGames } from '../../testing/mock-data/mock-games';
import { GamesDbService } from './games-db.service';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  private games: IGame[] | null = null;

  private gameSub = new BehaviorSubject<IGame[] | null>(this.games);

  public readonly highScoreSize: number = 8;

  constructor(private readonly gamesDbService: GamesDbService) {}

  public addGame(game: IGame): void {
    if (!this.games) {
      this.games = [];
    }
    this.gamesDbService.addGame(game).subscribe((gameWithId) => {
      this.games!.push(gameWithId);
      this.gameSub.next(this.games);
    });
  }

  public getGames(): IGame[] {
    return this.games || [];
  }

  public subToGames(topLength: number = this.highScoreSize): Observable<IGame[] | null> {
    if (this.games === null) {
      this.gamesDbService.getGames().subscribe(games => {
        console.log('games all', games);
        this.games = games;
        this.gameSub.next(this.games);
      });
    }

    return this.gameSub
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
}

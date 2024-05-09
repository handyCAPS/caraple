import { Injectable } from '@angular/core';
import { NgxIndexedDBService, WithID } from 'ngx-indexed-db';
import { Observable, catchError, of, take } from 'rxjs';
import { IGame } from '../interfaces/game.interface';
import { EDBKeys } from '../../indexdb/db-keys';
import { mockGames } from '../../testing/mock-data/mock-games';

@Injectable({
  providedIn: 'root',
})
export class GamesDbService {
  constructor(private readonly db: NgxIndexedDBService) {
    // this.clearTable();
  }

  getGames(): Observable<IGame[]> {
    return this.db.getAll<IGame>(EDBKeys.games).pipe(take(1));
  }

  public addGame(game: IGame): Observable<IGame<number> & WithID> {
    return this.db.add(EDBKeys.games, game).pipe(
      catchError((error) => {
        console.log('error adding game', error);
        return of();
      }),
      take(1)
    );
  }

  private bulkAdd(games: IGame[]): void {
    const idlessGames = games.map((game) => {
      const { id, ...idless } = game;
      return idless;
    });
    this.db.bulkAdd(EDBKeys.games, idlessGames).pipe(take(1)).subscribe();
  }

  private clearTable() {
    this.db.clear(EDBKeys.games).pipe(take(1)).subscribe();
  }
}

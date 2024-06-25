import { Injectable } from '@angular/core';
import { NgxIndexedDBService, WithID } from 'ngx-indexed-db';
import { Observable, catchError, map, mergeMap, of, take } from 'rxjs';
import { IGame } from '../interfaces/game.interface';
import { EDBKeys, EStreakDBKey, IStreakDb } from '../../indexdb/db-keys';
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
    this.setStreak();
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

  public setStreak(ended: boolean = false): Observable<number> {
    return this.getStreakDb().pipe(
      mergeMap(({ id, user, count: currentStreak }) => {
        const newStreak = ended ? 0 : currentStreak + 1;
        return this.db.add(EDBKeys.streak, { count: newStreak, id, user }).pipe(
          map((result) => {
            console.log('result from adding', result);
            return newStreak;
          })
        );
      })
    );
  }

  public getStreak(): Observable<number> {
    return this.db.getByKey<IStreakDb>(EDBKeys.streak, EStreakDBKey.count).pipe(
      catchError((err) => {
        console.log('err', err);
        return of({ count: 0 });
      }),
      take(1),
      map((result) => result?.count ?? 0)
    );
  }

  private getStreakDb(): Observable<IStreakDb> {
    return this.db.getByKey<IStreakDb>(EDBKeys.streak, EStreakDBKey.count);
  }
}

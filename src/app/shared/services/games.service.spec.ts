import { TestBed } from '@angular/core/testing';

import { GamesService } from './games.service';
import { IGame } from '../interfaces/game.interface';
import { MockProvider } from 'ng-mocks';
import { GamesDbService } from './games-db.service';
import { of } from 'rxjs';

describe('GamesService', () => {
  let service: GamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(GamesDbService, {
          getGames: () => of([]),
          addGame: () => of(),
        }),
      ],
    });
    service = TestBed.inject(GamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns the top n games by time spent', () => {
    const testDate = new Date();
    const ms = 1000;
    const seconds = ms * 60;
    const minutes = ms * seconds;
    const timeSpentD = 6 * minutes + 41 * seconds;
    const timeSpentB = 12 * minutes + 15 * seconds;
    const timeSpentA = 15 * minutes + 41 * seconds;
    const timeSpentC = 23 * minutes + 12 * seconds;
    const testGameA: IGame = {
      id: 1,
      guesses: 3,
      date: testDate.valueOf(),
      timeSpent: timeSpentA,
      word: 'TESTY',
      user: {
        dateAdded: new Date().valueOf(),
        id: 'id',
        name: 'Name',
      },
    };
    const testGameB: IGame = {
      id: 2,
      guesses: 1,
      date: testDate.valueOf(),
      timeSpent: timeSpentB,
      word: 'JOINT',
      user: {
        dateAdded: new Date().valueOf(),
        id: 'id',
        name: 'Name',
      },
    };
    const testGameC: IGame = {
      id: 3,
      guesses: 5,
      date: testDate.valueOf(),
      timeSpent: timeSpentC,
      word: 'REHAB',
      user: {
        dateAdded: new Date().valueOf(),
        id: 'id',
        name: 'Name',
      },
    };
    const testGameD: IGame = {
      id: 4,
      guesses: 2,
      date: testDate.valueOf(),
      timeSpent: timeSpentD,
      word: 'SLATE',
      user: {
        dateAdded: new Date().valueOf(),
        id: 'id',
        name: 'Name',
      },
    };
    const setGameArray = [testGameA, testGameB, testGameC, testGameD];
    const topAll = service.getTopGames(4, setGameArray);
    const expectedTopAll = [testGameD, testGameB, testGameA, testGameC];
    expect(topAll).withContext('Top all').toEqual(expectedTopAll);
    const topThree = service.getTopGames(3, setGameArray);
    const expectedTopThree = [testGameD, testGameB, testGameA];
    expect(topThree).withContext('Top three').toEqual(expectedTopThree);
  });
});

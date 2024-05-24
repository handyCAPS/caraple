import { TestBed } from '@angular/core/testing';

import { GamesService } from './games.service';
import { IGame } from '../interfaces/game.interface';
import { MockProvider } from 'ng-mocks';
import { GamesDbService } from './games-db.service';
import { of } from 'rxjs';
import { mockGames } from '../../testing/mock-data/mock-games';

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

  it('returns the average time spent from an array of games', () => {
    const testDate = new Date();
    const ms = 1000;
    const seconds = ms * 60;
    const minutes = ms * seconds;
    const timeSpentD = 6 * minutes + 10 * seconds;
    const timeSpentB = 12 * minutes + 10 * seconds;
    const timeSpentA = 15 * minutes + 10 * seconds;
    const timeSpentC = 23 * minutes + 10 * seconds;
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
    const expected = 14 * minutes + 10 * seconds;
    const actual = service.getAverageTime([
      testGameA,
      testGameB,
      testGameC,
      testGameD,
    ]);
    expect(actual).toBe(expected);
  });

  it('rounds average time', () => {
    const testGames = mockGames.slice(0, 3);
    testGames[0].timeSpent = 100;
    testGames[1].timeSpent = 100;
    testGames[2].timeSpent = 101;
    const expectedAverage = 100;
    const actualAverage = service.getAverageTime(testGames);
    expect(actualAverage).toBe(expectedAverage);
  });
});

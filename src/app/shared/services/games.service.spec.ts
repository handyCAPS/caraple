import { TestBed } from '@angular/core/testing';

import { GamesService } from './games.service';
import { IGame } from '../interfaces/game.interface';

fdescribe('GamesService', () => {
  let service: GamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
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
      id: 'gameA',
      correctIndex: 3,
      date: testDate.valueOf(),
      timeSpent: timeSpentA,
      word: 'TESTY',
    };
    const testGameB: IGame = {
      id: 'gameB',
      correctIndex: 1,
      date: testDate.valueOf(),
      timeSpent: timeSpentB,
      word: 'JOINT',
    };
    const testGameC: IGame = {
      id: 'gameC',
      correctIndex: 5,
      date: testDate.valueOf(),
      timeSpent: timeSpentC,
      word: 'REHAB',
    };
    const testGameD: IGame = {
      id: 'gameD',
      correctIndex: 2,
      date: testDate.valueOf(),
      timeSpent: timeSpentD,
      word: 'SLATE',
    };
    service.addGame(testGameA);
    service.addGame(testGameB);
    service.addGame(testGameC);
    service.addGame(testGameD);
    const topAll = service.getTopGames(4);
    const expectedTopAll = [testGameD, testGameB, testGameA, testGameC];
    expect(topAll).withContext('Top all').toEqual(expectedTopAll);
    const topThree = service.getTopGames(3);
    const expectedTopThree = [testGameD, testGameB, testGameA];
    expect(topThree).withContext('Top three').toEqual(expectedTopThree);
  });
});

import { Subject, of } from 'rxjs';
import { mockGames } from '../../../testing/mock-data/mock-games';
import { GamesService } from '../../services/games.service';
import { ClockComponent } from './clock.component';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';
import { fakeAsync, flush } from '@angular/core/testing';
import { msAsTime } from '../../../testing/test-utils';
import { IGame } from '../../interfaces/game.interface';

xdescribe('ClockComponent', () => {
  beforeEach(() => {
    return MockBuilder(ClockComponent).provide(
      MockProvider(GamesService, {
        subToTopGames: () => of(mockGames),
        subtoAllGames: () => of(mockGames),
      })
    );
  });

  it('should create', () => {
    const fixture = MockRender(ClockComponent, {
      run: true,
    });
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });

  describe('Timer classes', () => {
    const fixture = MockRender(ClockComponent, {
      run: true,
    });
    const component = fixture.point.componentInstance;
    const { milliseconds, seconds, minutes } = msAsTime;
    const testOrder = [1, 3, 2, 0];
    const testGames = mockGames.slice(0, 4).map((game, index) => {
      let timeSpent = 1 * minutes;
      switch (index) {
        case testOrder[0]:
          timeSpent += 20 * seconds;
          break;
        case testOrder[1]:
          timeSpent += 30 * seconds + 100 * milliseconds;
          break;
        case testOrder[2]:
          timeSpent += 40 * seconds + 500 * milliseconds;
          break;
        case testOrder[3]:
          timeSpent += 50 * seconds + 750 * milliseconds;
          break;
      }
      return {
        ...game,
        timeSpent,
      };
    });
    afterEach(() => {
      flush();
    });
    // Run clock
    it('gives clock gold class while timer below fastest time', () => {
      pending();
    });

    it('gives clock silver class while timer below second fastest time', () => {
      pending();
    });

    it('gives clock bronze class while timer below third fastest time', () => {
      pending();
    });

    it('gives clock past-max class while timer beyond average time', () => {
      pending();
    });
  });
});

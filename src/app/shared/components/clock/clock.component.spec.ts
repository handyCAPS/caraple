import { of } from 'rxjs';
import { mockGames } from '../../../testing/mock-data/mock-games';
import { GamesService } from '../../services/games.service';
import { ClockComponent } from './clock.component';
import { MockBuilder, MockProvider, MockRender } from 'ng-mocks';

describe('ClockComponent', () => {
  beforeEach(() => {
    return MockBuilder(ClockComponent).provide(
      MockProvider(GamesService, {
        subToGames: () => of(mockGames)
      })
    );
  });

  it('should create', () => {
    const fixture = MockRender(ClockComponent, {
      run: true
    });
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });
});

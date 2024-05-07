import { ClockComponent } from './clock.component';
import { MockBuilder, MockRender } from 'ng-mocks';

describe('ClockComponent', () => {
  beforeEach(() => {
    return MockBuilder(ClockComponent);
  });

  it('should create', () => {
    const fixture = MockRender(ClockComponent);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });
});

import { BoardComponent } from './board.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { getText, testId } from '../../../testing/helpers';
import { WordService } from '../../services/word.service';
import { UniquePipe } from '../../pipes/unique.pipe';
import { KeyboardService } from '../../services/keyboard.service';
import { BoardRowComponent } from '../board-row/board-row.component';
import { ClockService } from '../../services/clock.service';

describe('BoardComponent', () => {
  let setLetter: (fixture: any, letter: string) => void;
  let setWord: (fixture: any, word: string) => void;

  beforeEach(() => {
    setLetter = (fixture: any, letter: string) => {
      const window = ngMocks.find(fixture, '.board');
      const testEvent = `keydown.${letter}`;
      ngMocks.trigger(window, testEvent);
    };

    setWord = (fixture: any, word: string) => {
      word.split('').forEach((letter) => {
        setLetter(fixture, letter);
        fixture.detectChanges();
      });
    };
  });

  beforeEach(() => {
    return MockBuilder(BoardComponent)
      .keep(WordService)
      .keep(KeyboardService)
      .keep(ClockService)
      .keep(UniquePipe);
  });

  it('should create', () => {
    const fixture = MockRender(BoardComponent);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });

  describe('Board', () => {
    it('has class board', () => {
      const fixture = MockRender(BoardComponent);
      const board = ngMocks.find(fixture, '.board');
      expect(board).toBeTruthy();
    });

    it('has a row for every row count', () => {
      const fixture = MockRender(BoardComponent);
      const component = fixture.point.componentInstance;
      const rows = ngMocks.findAll(fixture, BoardRowComponent);
      expect(rows.length).toBe(component.boardRows.length);
    });
  });

});

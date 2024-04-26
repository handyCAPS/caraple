import { BoardComponent } from './board.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { SharedModule } from '../../shared.module';
import { getText, testId } from '../../../testing/helpers';
import { WordService } from '../../services/word.service';
import { UniquePipe } from '../../pipes/unique.pipe';
import { KeyboardService } from '../../services/keyboard.service';

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
    return MockBuilder(BoardComponent, SharedModule)
      .keep(WordService)
      .keep(KeyboardService)
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

    it('has six rows of five letters', () => {
      const fixture = MockRender(BoardComponent);
      const rows = ngMocks.findAll(fixture, '.row');
      const letters = ngMocks.findAll(fixture, '.letter');
      expect(rows.length).withContext('Missing rows').toBe(6);
      expect(letters.length)
        .withContext('Missing letters')
        .toBe(6 * 5);
    });

    xit('has a list of used letters', () => {
      const fixture = MockRender(BoardComponent);
      const usedLettersBoard = ngMocks.find(testId('used-letters'));
      expect(usedLettersBoard).toBeDefined();
      setWord(fixture, 'ads');
      fixture.detectChanges();
      const usedLetter = ngMocks.find(fixture, testId('used-letter'));
      expect(getText(usedLetter)).toBe('a');
    });

    xit('sets used letters only once', () => {
      const fixture = MockRender(BoardComponent);
      const usedLettersBoard = ngMocks.find(testId('used-letters'));
      expect(usedLettersBoard).toBeDefined();
      const testWord = 'test';
      setWord(fixture, testWord);
      fixture.detectChanges();
      const usedLetters = ngMocks.findAll(fixture, testId('used-letter'));
      expect(usedLetters.length).toBe(3);
      const tCount = usedLetters
        .map((el) => getText(el) as string)
        .join('')
        .match(/t/gi)?.length;
      expect(tCount).toBe(1);
    });
  });

  describe('Setting letters', () => {
    it('sets typed letter as letter', () => {
      const fixture = MockRender(BoardComponent);
      const testLetter = 'T';
      setLetter(fixture, testLetter);
      fixture.detectChanges();
      const letters = ngMocks.findAll(fixture, testId('letter'));
      expect(getText(letters[0])).toBe(testLetter);
    });

    it('sets each letter in next tile', () => {
      const fixture = MockRender(BoardComponent);
      const testWord = 'TEST';
      setWord(fixture, testWord);
      const letters = ngMocks.findAll(fixture, '.letter');
      letters
        .filter((letter, index) => index < testWord.length)
        .forEach((letterEl, letterIndex) => {
          expect(getText(letterEl))
            .withContext('Letter ' + letterIndex)
            .toBe(testWord[letterIndex]);
        });
    });

    it('stops entering letters when row full', () => {
      const fixture = MockRender(BoardComponent);
      const component = fixture.point.componentInstance;
      const rowLength = 5;
      const testWord = 'TESTINGLONGWORD';
      setWord(fixture, testWord);
      const letters = ngMocks.findAll(fixture, '.letter');
      letters.forEach((letterEl, letterIndex) => {
        if (letterIndex < rowLength) {
          expect(getText(letterEl))
            .withContext('before end of row')
            .toBe(testWord[letterIndex]);
        } else {
          expect(getText(letterEl)).withContext('after end of row').toBe('');
        }
      });
    });

    it('has a submit button when row is filled', () => {
      const fixture = MockRender(BoardComponent);
      const testWord = 'REHAB';
      const ifNotFound = 'NOT FOUND';
      const submitBefore = ngMocks.find(
        fixture,
        testId('btn-submit'),
        ifNotFound
      );
      expect(submitBefore).withContext('Before').toBe(ifNotFound);
      setWord(fixture, testWord);
      const submitButton = ngMocks.find(fixture, testId('btn-submit'));
      expect(submitButton).withContext('After').toBeDefined();
    });

    it('adds "guessed" class to checked letters', () => {
      const guessedClass = '.guessed';
      const fixture = MockRender(BoardComponent);
      const component = fixture.point.componentInstance;
      const guessedLettersBefore = ngMocks.findAll(fixture, guessedClass);
      expect(guessedLettersBefore.length).withContext('Before').toBe(0);
      const testWord = 'REHAB';
      setWord(fixture, testWord);
      const submitButton = ngMocks.find(fixture, testId('btn-submit'));
      const submitSpy = spyOn(component, 'submitWord');
      submitSpy.and.callThrough();
      ngMocks.click(submitButton);
      fixture.detectChanges();
      expect(submitSpy).withContext('Submit function').toHaveBeenCalled();
      const guessedLetters = ngMocks.findAll(fixture, guessedClass);
      expect(guessedLetters.length).withContext('After').toBe(testWord.length);
    });

    it('adds current class to row being guessed', () => {
      const fixture = MockRender(BoardComponent);
      const component = fixture.point.componentInstance;
      const currentBefore = ngMocks.findAll(fixture, '.current');
      expect(currentBefore.length).withContext('Before').toBe(1);
      const rowsBefore = ngMocks.findAll(fixture, testId('row'));
      expect(rowsBefore[1].classes['current'])
        .withContext('Classes on wrong row before')
        .toBeUndefined();
      setWord(fixture, 'PILOT');
      const submitButton = ngMocks.find(fixture, testId('btn-submit'));
      const submitSpy = spyOn(component, 'submitWord');
      submitSpy.and.callThrough();
      ngMocks.click(submitButton);
      fixture.detectChanges();
      const currentAfter = ngMocks.findAll(fixture, '.current');
      expect(currentAfter.length).withContext('After').toBe(1);
      const rows = ngMocks.findAll(fixture, testId('row'));
      expect(rows[1].classes['current'])
        .withContext('Classes on wrong row after')
        .toBeTrue();
    });

    it('removes letters with backspace', () => {
      // TODO: Test Backspace as first key
      const fixture = MockRender(BoardComponent);
      const component = fixture.point.componentInstance;
      setWord(fixture, 'REHAB');
      setLetter(fixture, 'backspace');
      fixture.detectChanges();
      const letters = ngMocks.findAll(testId('letter'));
      expect(getText(letters[4])).toBe('');
    });
  });
});

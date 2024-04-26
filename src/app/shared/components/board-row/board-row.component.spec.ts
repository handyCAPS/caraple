import { testId, getText } from '../../../testing/helpers';
import { KeyboardService } from '../../services/keyboard.service';
import { WordService } from '../../services/word.service';
import { KbKey } from '../board/KbKey';
import { BoardRowComponent } from './board-row.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

describe('BoardRowComponent', () => {
  let setLetter: (fixture: any, letter: string) => void;
  let setWord: (fixture: any, word: string) => void;

  beforeEach(() => {
    return MockBuilder(BoardRowComponent)
      .keep(WordService)
      .keep(KeyboardService);
  });

  beforeEach(() => {
    setLetter = (fixture: any, letter: string) => {
      const row = ngMocks.find(fixture, testId('row'));
      const testEvent = `keydown.${letter}`;
      ngMocks.trigger(row, testEvent);
    };

    setWord = (fixture: any, word: string) => {
      word.split('').forEach((letter) => {
        setLetter(fixture, letter);
        fixture.detectChanges();
      });
    };
  });

  describe('Component', () => {
    it('should create', () => {
      const fixture = MockRender(BoardRowComponent);
      const component = fixture.point.componentInstance;
      expect(component).toBeTruthy();
    });

    it('has a row of letters', () => {
      const fixture = MockRender(BoardRowComponent);
      const component = fixture.point.componentInstance;
      const expectedLength = ngMocks.findInstance(WordService).getWordLength();
      expect(ngMocks.findAll(fixture, testId('letter')).length).toBe(
        expectedLength
      );
    });
  });

  describe('Setting letters', () => {
    it('sets typed letter as letter', () => {
      const fixture = MockRender(BoardRowComponent);
      const testLetter = 'T';
      setLetter(fixture, testLetter);
      fixture.detectChanges();
      const letters = ngMocks.findAll(fixture, testId('letter'));
      expect(getText(letters[0])).toBe(testLetter);
    });

    it('sets each letter in next tile', () => {
      const fixture = MockRender(BoardRowComponent);
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

    it('Ignores keys that arent used', () => {
      const fixture = MockRender(BoardRowComponent);
      const component = fixture.point.componentInstance;
      const f5Check = component.ignoreKey('f5');
      expect(f5Check).withContext('f5').toBeTrue();
      const controlCheck = component.ignoreKey('control');
      expect(controlCheck).withContext('control').toBeTrue();
      const shiftCheck = component.ignoreKey('shift');
      expect(shiftCheck).withContext('shift').toBeTrue();
      const numberCheck = component.ignoreKey('5');
      expect(numberCheck).withContext('number').toBeTrue();
      // Should be allowed
      const aCheck = component.ignoreKey('a');
      expect(aCheck).withContext('a').toBeFalse();
      const zCheck = component.ignoreKey('z');
      expect(zCheck).withContext('z').toBeFalse();
      const BackspaceCheck = component.ignoreKey(KbKey.backspace);
      expect(BackspaceCheck).withContext(KbKey.backspace).toBeFalse();
      const EnterCheck = component.ignoreKey(KbKey.enter);
      expect(EnterCheck).withContext(KbKey.enter).toBeFalse();
    });

    it('stops entering letters when row full', () => {
      const fixture = MockRender(BoardRowComponent);
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

    it('emits rowFull when row filled', () => {
      const fixture = MockRender(BoardRowComponent);
      const component = fixture.point.componentInstance;
      const testWord = 'TESTY';
      spyOn(component.rowFilled, 'emit');
      setWord(fixture, testWord);
      fixture.detectChanges();
      expect(component.rowFilled.emit).toHaveBeenCalled();
    });

    it('emits rowGuessed when row entered', () => {
      const fixture = MockRender(BoardRowComponent);
      const component = fixture.point.componentInstance;
      const testWord = 'TESTY';
      spyOn(component.rowGuessed, 'emit');
      setWord(fixture, testWord);
      expect(component.rowGuessed.emit)
        .withContext('Too soon')
        .not.toHaveBeenCalled();
      setLetter(fixture, 'enter');
      fixture.detectChanges();
      expect(component.rowGuessed.emit).toHaveBeenCalledWith(true);
    });

    it('sets guess map in keyboard service when word checked', () => {
      const fixture = MockRender(BoardRowComponent);
      const component = fixture.point.componentInstance;
      const testWord = 'REHA';
      const kbService = ngMocks.findInstance(fixture, KeyboardService);
      spyOn(kbService, 'setGuessMap');
      setWord(fixture, testWord);
      expect(kbService.setGuessMap)
        .withContext('Too soon')
        .not.toHaveBeenCalled();
      setLetter(fixture, 'B');
      setLetter(fixture, 'enter');
      fixture.detectChanges();
      expect(kbService.setGuessMap).toHaveBeenCalled();
    });

    it('adds "guessed" class to checked letters', () => {
      // const guessedClass = '.guessed';
      // const fixture = MockRender(BoardRowComponent);
      // const component = fixture.point.componentInstance;
      // const guessedLettersBefore = ngMocks.findAll(fixture, guessedClass);
      // expect(guessedLettersBefore.length).withContext('Before').toBe(0);
      // const testWord = 'REHAB';
      // setWord(fixture, testWord);
      // const submitButton = ngMocks.find(fixture, testId('btn-submit'));
      // const submitSpy = spyOn(component, 'submitWord');
      // submitSpy.and.callThrough();
      // ngMocks.click(submitButton);
      // fixture.detectChanges();
      // expect(submitSpy).withContext('Submit function').toHaveBeenCalled();
      // const guessedLetters = ngMocks.findAll(fixture, guessedClass);
      // expect(guessedLetters.length).withContext('After').toBe(testWord.length);
    });

    it('adds current class to row being guessed', () => {
      // const fixture = MockRender(BoardRowComponent);
      // const component = fixture.point.componentInstance;
      // const currentBefore = ngMocks.findAll(fixture, '.current');
      // expect(currentBefore.length).withContext('Before').toBe(1);
      // const rowsBefore = ngMocks.findAll(fixture, testId('row'));
      // expect(rowsBefore[1].classes['current'])
      //   .withContext('Classes on wrong row before')
      //   .toBeUndefined();
      // setWord(fixture, 'PILOT');
      // const submitButton = ngMocks.find(fixture, testId('btn-submit'));
      // const submitSpy = spyOn(component, 'submitWord');
      // submitSpy.and.callThrough();
      // ngMocks.click(submitButton);
      // fixture.detectChanges();
      // const currentAfter = ngMocks.findAll(fixture, '.current');
      // expect(currentAfter.length).withContext('After').toBe(1);
      // const rows = ngMocks.findAll(fixture, testId('row'));
      // expect(rows[1].classes['current'])
      //   .withContext('Classes on wrong row after')
      //   .toBeTrue();
    });

    it('removes letters with backspace', () => {
      // TODO: Test Backspace as first key
      const fixture = MockRender(BoardRowComponent);
      const component = fixture.point.componentInstance;
      setWord(fixture, 'REHAB');
      setLetter(fixture, 'backspace');
      fixture.detectChanges();
      const letters = ngMocks.findAll(testId('letter'));
      expect(getText(letters[4])).toBe('');
    });
  });
});

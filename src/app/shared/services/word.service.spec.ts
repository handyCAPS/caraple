import { TestBed } from '@angular/core/testing';

import { WordService } from './word.service';
import { getMockRow } from '../../testing/mock-data/mock-row';
import {
  IGuessedKey,
  IKeyUseMap,
} from '../components/keyboard/keyboard.component';

describe('WordService', () => {
  let service: WordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns a 5 letter word', () => {
    const word = service.getWord();
    expect(word).toBeDefined();
    expect(word.length).toBe(5);
  });

  it('sets the guessed flag to true', () => {
    const testRow = service.checkWord(getMockRow('REHAB'), '');
    expect(testRow.guessed).toBeTrue();
  });

  it('checks row against word', () => {
    const testWordCorrect = 'REHAB';
    const testedRow = service.checkWord(
      getMockRow(testWordCorrect),
      testWordCorrect
    );
    expect(testedRow.correctWord).withContext('Correct word').toBeTrue();
    const testWordIncorrect = 'REHAB';
    const testedRowIncorrect = service.checkWord(
      getMockRow('PILOT'),
      testWordIncorrect
    );
    expect(testedRowIncorrect.correctWord)
      .withContext('Incorrect word')
      .toBeFalse();
  });

  it('sets correctSpace and correctLetters on checked letters', () => {
    const testWord = 'ROBES';
    const testRow = getMockRow('REHAB');
    const testedRow = service.checkWord(testRow, testWord);
    const { letters } = testedRow;
    const [R, E, H, A, B] = letters;
    expect(R.correctLetter).withContext('Missed correct letter').toBeTrue();
    expect(R.correctSpace).withContext('Missed correctSpace').toBeTrue();
    expect(E.correctLetter).withContext('Missed correct letter').toBeTrue();
    expect(E.correctSpace).withContext('Incorrect correctSpace').toBeFalse();
    expect(H.correctLetter).withContext('Incorrect correct letter').toBeFalse();
    expect(H.correctSpace).withContext('Incorrect correctSpace').toBeFalse();
    expect(A.correctLetter).withContext('Incorrec correct letter').toBeFalse();
    expect(A.correctSpace).withContext('Incorrect correctSpace').toBeFalse();
    expect(B.correctLetter).withContext('Missed correct letter').toBeTrue();
    expect(B.correctSpace).withContext('Incorrect correctSpace').toBeFalse();
  });

  it('removes the last letter from a row', () => {
    const testRow = getMockRow('REHAB');
    const result = service.removeLastLetter(testRow);
    expect(result.letters[4].letter).toBe('');
    const secondRemoval = service.removeLastLetter(result);
    expect(secondRemoval.letters[3].letter)
      .withContext('Failed second delete')
      .toBe('');
  });

  it('adds a letter to the row', () => {
    const testRow = getMockRow('REHA');
    const result = service.addLetterToRow(testRow, 'B');
    const fullWord = result.letters.map((letter) => letter.letter).join('');
    expect(fullWord).withContext('4 letters').toBe('REHAB');
    const emptyTestRow = getMockRow('');
    const resultEmpty = service.addLetterToRow(emptyTestRow, 'B');
    const fullWordEmpty = resultEmpty.letters
      .map((letter) => letter.letter)
      .join('');
    expect(fullWordEmpty).withContext('Empty').toBe('B');
  });

  it('Ignores empty spaces when deleting', () => {
    const testRow = getMockRow('REHA ');
    const result = service.removeLastLetter(testRow);
    expect(result.letters[3].letter).toBe('');
  });

  it('translates row to guesses', () => {
    const mockRow = getMockRow('REHAB');
    mockRow.letters[0].correctLetter = true;
    mockRow.letters[1].correctLetter = true;
    mockRow.letters[4].correctLetter = true;
    mockRow.letters[4].correctSpace = true;
    const expected: IKeyUseMap = {
      r: true,
      e: true,
      h: false,
      a: false,
      b: true,
    };
    const actual = service.rowToGuessMap(mockRow);
    expect(actual).toEqual(expected);
  });
});

import { TestBed } from '@angular/core/testing';

import { WordService } from './word.service';
import { getMockRow } from '../../testing/mock-data/mock-row';
import {
  IGuessedKey,
  IKeyUseMap,
} from '../components/keyboard/keyboard.component';
import { ILetter } from '../components/board/board.component';

describe('WordService', () => {
  let service: WordService;
  let isCorrect: {
    letter: (letter: ILetter, key: string) => void;
    space: (letter: ILetter, key: string) => void;
  };

  beforeEach(() => {
    isCorrect = {
      letter: (letter: ILetter, key: string) => {},
      space: (letter: ILetter, key: string) => {},
    };
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

  it('handles double letters', () => {
    const testWord = 'ROOMS';
    const testRow = getMockRow('BOOMS');
    const testedRow = service.checkWord(testRow, testWord);
    const { letters } = testedRow;
    expect(letters[0].correctLetter).withContext('B correctLetter').toBeFalse();
    expect(letters[0].correctSpace).withContext('B correctSpace').toBeFalse();
    expect(letters[1].correctLetter).withContext('O correctLetter').toBeTrue();
    expect(letters[1].correctSpace).withContext('O correctSpace').toBeTrue();

    expect(letters[2].correctLetter)
      .withContext('O (2) correctLetter')
      .toBeTrue();
    expect(letters[2].correctSpace)
      .withContext('O (2) correctSpace')
      .toBeTrue();

    expect(letters[3].correctLetter).withContext('M correctLetter').toBeTrue();
    expect(letters[3].correctSpace).withContext('M correctSpace').toBeTrue();

    expect(letters[4].correctLetter).withContext('S correctLetter').toBeTrue();
    expect(letters[4].correctSpace).withContext('S correctSpace').toBeTrue();
  });

  it('doesnt mark same letter twice', () => {
    const correctWord = 'BOOMY';
    const guessedRow = getMockRow('BOOBY');
    const testedGuess = service.checkWord(guessedRow, correctWord);
    const { letters } = testedGuess;
    const [guessB, guessO, guessO2, guessB2, guessY] = letters;
    expect(guessB.correctLetter).withContext('B correctLetter').toBeTrue();
    expect(guessB.correctSpace).withContext('B correctSpace').toBeTrue();

    expect(guessO.correctLetter).withContext('O correctLetter').toBeTrue();
    expect(guessO.correctSpace).withContext('O correctSpace').toBeTrue();

    expect(guessO2.correctLetter).withContext('O2 correctLetter').toBeTrue();
    expect(guessO2.correctSpace).withContext('O2 correctSpace').toBeTrue();

    expect(guessB2.correctLetter).withContext('B2 correctLetter').toBeFalse();
    expect(guessB2.correctSpace).withContext('B2 correctSpace').toBeFalse();

    expect(guessY.correctLetter).withContext('Y correctLetter').toBeTrue();
    expect(guessY.correctSpace).withContext('Y correctSpace').toBeTrue();

    const correctWordTwo = 'TENSE';
    const guessedRowTwo = getMockRow('TEETS');
    const testedGuessTwo = service.checkWord(guessedRowTwo, correctWordTwo);
    const { letters: lettersTwo } = testedGuessTwo;
    const [guessT, guessE, guessE2, guessT2, guessS] = lettersTwo;
    expect(guessT.correctLetter).withContext('T correctLetter').toBeTrue();
    expect(guessT.correctSpace).withContext('T correctSpace').toBeTrue();

    expect(guessE.correctLetter).withContext('E correctLetter').toBeTrue();
    expect(guessE.correctSpace).withContext('E correctSpace').toBeTrue();

    expect(guessE2.correctLetter).withContext('E2 correctLetter').toBeTrue();
    expect(guessE2.correctSpace).withContext('E2 correctSpace').toBeFalse();

    expect(guessT2.correctLetter).withContext('T2 correctLetter').toBeFalse();
    expect(guessT2.correctSpace).withContext('T2 correctSpace').toBeFalse();

    expect(guessS.correctLetter).withContext('S correctLetter').toBeTrue();
    expect(guessS.correctSpace).withContext('S correctSpace').toBeFalse();

    const correctWordThree = 'FAUNA';
    const guessedRowThree = getMockRow('CANNY');
    const testedGuessThree = service.checkWord(guessedRowThree, correctWordThree);
    const { letters: lettersThree } = testedGuessThree;
    const [GuessC, guessA, guessN, guessN2, guessYy] = lettersThree;
    expect(GuessC.correctLetter).withContext('C correctLetter').toBeFalse();
    expect(GuessC.correctSpace).withContext('C correctSpace').toBeFalse();

    expect(guessA.correctLetter).withContext('A correctLetter').toBeTrue();
    expect(guessA.correctSpace).withContext('A correctSpace').toBeTrue();
    // Correct letter, but later in correct space
    expect(guessN.correctLetter).withContext('N correctLetter').toBeFalse();
    expect(guessN.correctSpace).withContext('N correctSpace').toBeFalse();

    expect(guessN2.correctLetter).withContext('N2 correctLetter').toBeTrue();
    expect(guessN2.correctSpace).withContext('N2 correctSpace').toBeTrue();

    expect(guessYy.correctLetter).withContext('Y correctLetter').toBeFalse();
    expect(guessYy.correctSpace).withContext('Y correctSpace').toBeFalse();
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
      r: 2,
      e: 2,
      h: 1,
      a: 1,
      b: 3,
    };
    const actual = service.rowToGuessMap(mockRow);
    expect(actual).toEqual(expected);
  });

  it('doesnt reset a previously guessed letter', () => {
    pending();
  });
});

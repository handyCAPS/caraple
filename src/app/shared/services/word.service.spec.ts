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

  it('set guessed to true on checked row', () => {
    const correctWord = 'CRANE';
    const guessRow = getMockRow('REHAB');
    const testedGuess = service.checkWord(guessRow, correctWord);
    expect(testedGuess.guessed).toBeTrue();
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

  fdescribe('handling double letters', () => {
    it('doesnt mark letter that was correctSpace earlier', () => {
      const correctWord = 'ROCKS';
      const guessRow = getMockRow('BOOMS');
      const testedGuess = service.checkWord(guessRow, correctWord);
      const { letters: BOOMS } = testedGuess;
      const [letterB, letterO, letterO2, letterM, letterS] = BOOMS;
      expect(letterB.correctLetter).withContext('B correctLetter').toBeFalse();
      expect(letterB.correctSpace).withContext('B correctSpace').toBeFalse();
      expect(letterO.correctLetter).withContext('O correctLetter').toBeTrue();
      expect(letterO.correctSpace).withContext('O correctSpace').toBeTrue();
      // Second O should not be marked at all as first O is correctSpace
      expect(letterO2.correctLetter)
        .withContext('O (2) correctLetter')
        .toBeFalse();
      expect(letterO2.correctSpace)
        .withContext('O (2) correctSpace')
        .toBeFalse();

      expect(letterM.correctLetter).withContext('M correctLetter').toBeFalse();
      expect(letterM.correctSpace).withContext('M correctSpace').toBeFalse();

      expect(letterS.correctLetter).withContext('S correctLetter').toBeTrue();
      expect(letterS.correctSpace).withContext('S correctSpace').toBeTrue();
    });

    it('marks correctLetter only on first', () => {
      const correctWord = 'TEMPO';
      const guessedRow = getMockRow('BOOTS');
      // const testedGuess = service.checkWord(guessedRow, correctWord);
      const BOOTS2 = service.getMappedLetters(guessedRow.letters, correctWord);
      // const { letters: BOOTS } = testedGuess;
      const [letterB, letterO, letterO2, letterT, letterS] = BOOTS2;
      expect(letterO.correctLetter).withContext('O correctLetter').toBeTrue();
      expect(letterO.correctSpace).withContext('O correctSpace').toBeFalse();
      expect(letterO2.correctLetter)
        .withContext('O2 correctLetter')
        .toBeFalse();
      expect(letterO2.correctSpace).withContext('O2 correctSpace').toBeFalse();
    });

    it('marks correctSpace only on first', () => {
      const correctWord = 'BOOMY';
      const guessedRow = getMockRow('BOOBY');
      const testedGuess = service.checkWord(guessedRow, correctWord);
      const { letters: BOOBY } = testedGuess;
      const [guessB, guessO, guessO2, guessB2, guessY] = BOOBY;
      expect(guessB.correctLetter).withContext('B correctLetter').toBeTrue();
      expect(guessB.correctSpace).withContext('B correctSpace').toBeTrue();

      expect(guessB2.correctLetter).withContext('B2 correctLetter').toBeFalse();
      expect(guessB2.correctSpace).withContext('B2 correctSpace').toBeFalse();
    });

    it('doesnt mark a letter if same letter is later in correctSpace', () => {
      const correctWord = 'COAST';
      const guessedRow = getMockRow('STUNT');
      const testedGuess = service.checkWord(guessedRow, correctWord);
      const { letters: STUNT } = testedGuess;
      const [letterS, letterT, letterU, letterN, letterT2] = STUNT;
      expect(letterS.correctLetter).withContext('S correctLetter').toBeTrue();
      expect(letterT.correctLetter).withContext('T correctLetter').toBeFalse();
      expect(letterT.correctSpace).withContext('T correctSpace').toBeFalse();
      expect(letterT2.correctLetter).withContext('T2 correctLetter').toBeTrue();
      expect(letterT2.correctSpace).withContext('T2 correctSpace').toBeTrue();
    });

    it('does mark the same letter if correctLetter later', () => {
      const correctWord = 'TENSE';
      const guessedRow = getMockRow('TEETS');
      const testedGuess = service.checkWord(guessedRow, correctWord);
      const { letters: TEETS } = testedGuess;
      const [letterT, letterE, letterE2, letterT2, letterS] = TEETS;
      expect(letterT.correctLetter).withContext('T correctLetter').toBeTrue();
      expect(letterT.correctSpace).withContext('T correctSpace').toBeTrue();

      expect(letterE.correctLetter).withContext('E correctLetter').toBeTrue();
      expect(letterE.correctSpace).withContext('E correctSpace').toBeTrue();

      expect(letterE2.correctLetter).withContext('E2 correctLetter').toBeTrue();
      expect(letterE2.correctSpace).withContext('E2 correctSpace').toBeFalse();

      expect(letterT2.correctLetter)
        .withContext('T2 correctLetter')
        .toBeFalse();
      expect(letterT2.correctSpace).withContext('T2 correctSpace').toBeFalse();

      expect(letterS.correctLetter).withContext('S correctLetter').toBeTrue();
      expect(letterS.correctSpace).withContext('S correctSpace').toBeFalse();
    });

    it('handles any number of identical letters', () => {
      const correctWord = 'FFFFP';
      const guessedRow = getMockRow('FFFFF');
      const FFFFF = service.getMappedLetters(guessedRow.letters, correctWord);
      const [letterF1, letterF2, letterF3, letterF4, letterF5] = FFFFF;
      expect(letterF1.correctLetter).withContext('F1 correctLetter').toBeTrue();
      expect(letterF1.correctSpace).withContext('F1 correctSpace').toBeTrue();
      expect(letterF2.correctLetter).withContext('F2 correctLetter').toBeTrue();
      expect(letterF2.correctSpace).withContext('F2 correctSpace').toBeTrue();
      expect(letterF3.correctLetter).withContext('F3 correctLetter').toBeTrue();
      expect(letterF3.correctSpace).withContext('F3 correctSpace').toBeTrue();
      expect(letterF4.correctLetter).withContext('F4 correctLetter').toBeTrue();
      expect(letterF4.correctSpace).withContext('F4 correctSpace').toBeTrue();
      expect(letterF5.correctLetter).withContext('F5 correctLetter').toBeFalse();
      expect(letterF5.correctSpace).withContext('F5 correctSpace').toBeFalse();
    });
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

  describe('rowToGuessMap', () => {
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
      const mockRow = getMockRow('KEBAB');
      const [letterK, letterE, letterB, letterA, letterB2] = mockRow.letters;
      letterK.correctLetter = true; // K becomes 2
      letterE.correctLetter = true; // E becomes 2
      letterB.correctSpace = true; // B becomes 3
      letterB2.correctLetter = false; // B should stay 3
      letterB2.correctSpace = false; // B should stay 3

      const expected: IKeyUseMap = {
        k: 2,
        e: 2,
        b: 3,
        a: 1,
      };
      const actual = service.rowToGuessMap(mockRow);
      expect(actual).toEqual(expected);
    });

    it('keeps the highest value achieved by a key', () => {
      const mockRow = getMockRow('BOOBS');
      mockRow.letters[0].correctLetter = false; // B becomes 1
      mockRow.letters[3].correctLetter = true; // B should become 2
      mockRow.letters[1].correctLetter = true; // O becomes 3
      mockRow.letters[2].correctSpace = true; // O should not become 1
      const expected: IKeyUseMap = {
        b: 2,
        o: 3,
        s: 1,
      };
      const actual = service.rowToGuessMap(mockRow);
      expect(actual).toEqual(expected);
    });
  });
});

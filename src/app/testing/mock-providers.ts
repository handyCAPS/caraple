import { MockProvider } from 'ng-mocks';
import { WordService } from '../shared/services/word.service';
import { getMockRow, getMockRowArray, mockLetter } from './mock-data/mock-row';
import { FactoryProvider } from '@angular/core';
import { ILetter, IRow } from '../shared/components/board/board.component';

export const WordServiceProvider = MockProvider(WordService, {
  wordIsCorrect: () => true,
  getWordLength: () => 5,
  // getRows: () => getMockRowArray(5),
  getRow: () => getMockRow(''),
  // getLetter: () => mockLetter('first', 'a'),
  // getLetters: () => getMockRow('REHAB').letters,
  getWord: () => 'TESTY',
  checkWordInList: () => true,
  // checkWord: (row: IRow) => row,
  removeLastLetter: (row: IRow) => removeLastLetter(row),
  addLetterToRow: (row) => addLetterToRow(row, 'a'),
});

export function getWordServiceProvider({
  wordIsCorrect,
  getWordLength,
  getRows,
  getRow,
  getLetter,
  getLetters,
  getWord,
  checkWordInList,
  checkWord,
}: {
  wordIsCorrect?: boolean;
  getWordLength?: number;
  getRows?: IRow[];
  getRow?: IRow;
  getLetter?: ILetter;
  getLetters?: ILetter[];
  getWord?: string;
  checkWordInList?: boolean;
  checkWord?: IRow;
}): FactoryProvider {
  return MockProvider(WordService, {
    wordIsCorrect: () => wordIsCorrect ?? true,
    getWordLength: () => getWordLength ?? 5,
    getRows: () => getRows ?? getMockRowArray(5),
    getRow: () => getRow ?? getMockRow(''),
    getLetter: () => getLetter ?? mockLetter('first', ''),
    getLetters: () => getLetters ?? getMockRow('').letters,
    getWord: () => getWord ?? 'TESTY',
    checkWordInList: () => checkWordInList ?? true,
    checkWord: (row) => checkWord ?? row,
    removeLastLetter: (row: IRow) => removeLastLetter(row),
    addLetterToRow: (row, letter) => addLetterToRow(row, letter),
  });
}

function removeLastLetter(row: IRow): IRow {
  let removeIndex =
    row.letters
      .map((letter) => letter.letter)
      .join('')
      .trim().length - 1;
  return {
    ...row,
    letters: row.letters.map((letter, index) => {
      if (index === removeIndex) {
        return { ...letter, letter: '' };
      }
      return letter;
    }),
  };
}

function addLetterToRow(row: IRow, letter: string): IRow {
  let setOne = false;
  return {
    ...row,
    letters: row.letters.map((l) => {
      if (setOne || /[a-z]/i.test(l.letter)) {
        return l;
      }
      setOne = true;
      return {
        ...l,
        letter,
      };
    }),
  };
}

import { ILetter, IRow } from '../../shared/components/board/board.component';

export function mockLetter(id: string, letter: string): ILetter {
  return {
    letter,
    id,
  };
}

export const mockRow: IRow = {
  letters: [
    mockLetter('1', 'r'),
    mockLetter('2', 'e'),
    mockLetter('3', 'h'),
    mockLetter('4', 'a'),
    mockLetter('5', 'b'),
  ],
};

export function getMockRow(word: string): IRow {
  return {
    letters: [
      mockLetter('1', word[0] || ''),
      mockLetter('2', word[1] || ''),
      mockLetter('3', word[2] || ''),
      mockLetter('4', word[3] || ''),
      mockLetter('5', word[4] || ''),
    ],
  };
}

export function getMockRowArray(length: number, words?: string []): IRow[] {
  const letters = words || [''];
  return [...new Array(length)].map((l, idx) => getMockRow(letters[idx] ?? letters[0]));
}

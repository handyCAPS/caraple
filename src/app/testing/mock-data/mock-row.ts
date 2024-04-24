import { ILetter, IRow } from '../../shared/components/board/board.component';

export function mockLetter(id: string, letter: string): ILetter {
  return {
    letter,
    id,
  };
}

export const mockRow: IRow = {
  id: 'testid',
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
    id: 'testid',
    letters: [
      mockLetter('1', word[0]),
      mockLetter('2', word[1]),
      mockLetter('3', word[2]),
      mockLetter('4', word[3]),
      mockLetter('5', word[4]),
    ],
  }
}

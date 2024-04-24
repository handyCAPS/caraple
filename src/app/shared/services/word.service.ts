import { Injectable } from '@angular/core';
import { ILetter, IRow } from '../components/board/board.component';
import { words } from '../../lists/en/words';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  private words: string[] = words;

  private wordToGuess: string = '';

  constructor() {
    this.wordToGuess = this.getRandomWord();
  }

  public getRows(rowCount: number, letterCount: number): IRow[] {
    return [...new Array(rowCount)].map((row, rowIndex) => {
      const letterArray = [...new Array(letterCount)].map(
        (letter, letterIndex) => this.getLetter(rowIndex, letterIndex)
      );

      return {
        id: `row-${rowIndex}`,
        letters: letterArray,
      } as IRow;
    });
  }

  public getLetter(rowCount: number, letterCount: number): ILetter {
    return {
      id: `letter-${rowCount}-${letterCount}`,
      letter: '',
      correctLetter: false,
      correctSpace: false,
    };
  }

  public getWord(): string {
    return this.wordToGuess;
  }

  private getRandomWord(): string {
    const randomIndex = Math.floor(Math.random() * this.words.length);
    return this.words[randomIndex];
  }

  public checkWordInList(word: string): boolean {
    return this.words.includes(word.toLowerCase());
  }

  public checkWord(row: IRow, word: string): IRow {
    const correctWord = row.letters.map((l) => l.letter).join('') === word;
    return {
      ...row,
      guessed: true,
      letters: row.letters.map((letter, index) => {
        const l = letter.letter.toLowerCase();
        const w = word.toLowerCase();
        const correctLetter = w.includes(l);
        const correctSpace = w.indexOf(l) === index;
        return {
          ...letter,
          correctLetter,
          correctSpace,
        };
      }),
      correctWord,
    };
  }

  public removeLastLetter(row: IRow): IRow {
    let removeIndex =
      row.letters.map((letter) => letter.letter).join('').length - 1;
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
}

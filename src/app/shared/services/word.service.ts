import { Injectable } from '@angular/core';
import { ILetter, IRow } from '../components/board/board.component';
import { words } from '../../lists/en/words';
import {
  IGuessedKey,
  IKeyUseMap,
} from '../components/keyboard/keyboard.component';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  private wordLength = 5;
  private words: string[] = words;

  private wordToGuess: string = '';

  constructor() {
    this.wordToGuess = this.getRandomWord();
  }

  public getWordLength(): number {
    return this.wordLength;
  }

  public getRows(rowCount: number, letterCount: number): IRow[] {
    return [...new Array(rowCount)].map((row, rowIndex) => {
      const letterArray = [...new Array(letterCount)].map(
        (letter, letterIndex) => this.getLetter(letterIndex)
      );

      return {
        id: `row-${rowIndex}`,
        letters: letterArray,
      } as IRow;
    });
  }

  public getLetter(letterCount: number): ILetter {
    return {
      id: `letter-${letterCount}`,
      letter: '',
      correctLetter: false,
      correctSpace: false,
    };
  }

  public getLetters(): ILetter[] {
    return [...new Array(this.wordLength)].map((_, i) => this.getLetter(i));
  }

  public getWord(): string {
    console.log('this.wordToGuess', this.wordToGuess);
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

  public addLetterToRow(row: IRow, letter: string): IRow {
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

  public rowToGuessMap(row: IRow): IKeyUseMap {
    return row.letters.reduce((prev, curr) => {
      return {
        ...prev,
        [curr.letter.toLowerCase()]: !!curr.correctLetter,
      };
    }, {});
  }
}

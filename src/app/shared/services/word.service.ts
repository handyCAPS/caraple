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

  public wordIsCorrect(guessWord: string): boolean {
    console.log('guessedWord, this.wordToGuess', guessWord, this.wordToGuess);
    return guessWord.toLowerCase() === this.wordToGuess;
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
        letters: letterArray,
      };
    });
  }

  public getRow(letterCount: number): IRow {
    const letterArray = [...new Array(letterCount)].map((letter, letterIndex) =>
      this.getLetter(letterIndex)
    );

    return {
      letters: letterArray,
    };
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

  public checkWord(row: IRow, word?: string): IRow {
    const correct: {
      space: string[];
      letter: string[];
    } = {
      space: [],
      letter: [],
    };
    const rowWord = row.letters
      .map((l) => l.letter)
      .join('')
      .toLowerCase();
    const wordToCheck = (word || this.wordToGuess).toLowerCase();
    const correctWord = rowWord === wordToCheck;
    return {
      ...row,
      guessed: true,
      letters: row.letters.map((letter, index) => {
        const letterBeingChecked = letter.letter.toLowerCase();
        const correctSpace = wordToCheck
          .split('')
          .some((checkLetter, checkIndex) => {
            const correctSp =
              checkLetter === letterBeingChecked && checkIndex === index;
            correct.space.push(letterBeingChecked);
            return correctSp;
          });
        const correctLetter =
          wordToCheck.includes(letterBeingChecked) &&
          correct.letter.indexOf(letterBeingChecked) === -1;
        if (correctLetter) {
          correct.letter.push(letterBeingChecked);
        }
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

  private letterToEnum(letter: ILetter): 1 | 2 | 3 {
    // TODO: Make sure not to unset a letter
    if (letter.correctSpace) {
      return 3;
    }
    if (letter.correctLetter) {
      return 2;
    }

    return 1;
  }

  public rowToGuessMap(row: IRow): IKeyUseMap {
    return [...new Set(row.letters)].reduce((prev, curr) => {
      return {
        ...prev,
        [curr.letter.toLowerCase()]: this.letterToEnum(curr),
      };
    }, {});
  }
}

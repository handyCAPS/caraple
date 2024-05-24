import { Injectable } from '@angular/core';
import { ILetter, IRow } from '../components/board/board.component';
import { words } from '../../lists/en/words';
import {
  IGuessedKey,
  IKeyUseMap,
} from '../components/keyboard/keyboard.component';
import { countLetters } from '../helpers/helpers';

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

  public checkWord(row: IRow, wordToGuess?: string): IRow {
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
    const wordToCheck = (wordToGuess || this.wordToGuess).toLowerCase();
    const correctWord = rowWord === wordToCheck;
    return {
      ...row,
      guessed: true,
      letters: this.getMappedLetters(row.letters, wordToCheck),
      correctWord,
    };
  }

  public getMappedLetters(
    letters: ILetter[],
    wordToCheckAgainst: string
  ): ILetter[] {
    const correct: { letters: string[]; spaces: string[] } = {
      letters: [],
      spaces: [],
    };
    return letters.map((letter, indexBeingChecked) => {
      const letterBeingChecked = letter.letter.toLowerCase();
      let correctSpace = false;
      let correctLetter = false;
      wordToCheckAgainst
        .toLowerCase()
        .split('')
        .forEach((wordToCheckLetter: string, correctIndex: number) => {
          let isSeenBefore: boolean = false;
          if (wordToCheckLetter === letterBeingChecked) {
            correctLetter = true;
            if (correct.letters.includes(letterBeingChecked)) {
              // Letter has been seen before
              isSeenBefore = true;
              const letterCount = countLetters(
                letterBeingChecked,
                wordToCheckAgainst
              );
              const seenBeforeCount = countLetters(
                letterBeingChecked,
                correct.letters
              );
              if (seenBeforeCount >= letterCount) {
                correctLetter = false;
              }
            }
            // If letter correct or correctSpace, check if letter appears again or before
            // If appears again check if value is higher (space > letter)
            if (indexBeingChecked === correctIndex) {
              correctSpace = true;
              correctLetter = true;
              if (correct.letters.includes(letterBeingChecked)) {

                if (correct.spaces.includes(wordToCheckLetter)) {
                }
              }
              correct.spaces.push(wordToCheckLetter);
            }
          }
        });
      if (correctLetter) {
        correct.letters.push(letterBeingChecked);
      }
      if (correctSpace) {
        correct.spaces.push(letterBeingChecked);
      }
      return {
        ...letter,
        correctLetter,
        correctSpace,
      };
    });
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
    if (letter.correctSpace) {
      return 3;
    }
    if (letter.correctLetter) {
      return 2;
    }

    return 1;
  }

  public rowToGuessMap(row: IRow): IKeyUseMap {
    // To prevent letters being overwritten
    const setLetters: ILetter[] = [];
    return row.letters.reduce((prev, curr) => {
      const currLetter = curr.letter.toLowerCase();
      const setLetter = setLetters.find(
        (setletter) => setletter.letter.toLowerCase() === currLetter
      );
      if (setLetter) {
        const setLetterStrength = this.letterToEnum(setLetter);
        const currStrength = this.letterToEnum(curr);
        console.log(
          'setLetterStrength, currStrength',
          setLetterStrength,
          currStrength
        );
        if (setLetterStrength > currStrength) {
          return {
            ...prev,
          };
        }
      }
      setLetters.push(curr);
      return {
        ...prev,
        [currLetter]: this.letterToEnum(curr),
      };
    }, {});
  }
}

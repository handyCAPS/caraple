import { Component, HostListener, effect, input } from '@angular/core';
import { WordService } from '../../services/word.service';
import { KbKey } from './KbKey';

export interface ILetter {
  id: string;
  letter: string;
  correctLetter?: boolean;
  correctSpace?: boolean;
}

export interface IRow {
  id: string;
  letters: ILetter[];
  guessed?: boolean;
  correctWord?: boolean;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  @HostListener('window:keydown', ['$event'])
  windowKeydown(event: KeyboardEvent) {
    const { key } = event;
    if (this.rowFull() && key !== KbKey.backspace && key !== KbKey.enter) {
      return;
    }
    if (this.guessedCorrect) {
      return;
    }
    if (key === KbKey.enter) {
      event.preventDefault();
      if (this.offerSubmit) {
        this.submitWord();
      }
      return;
    }
    this.handleKeyDown(key);
  }

  public keyStroke = input<string>();

  public wordToGuess: string = '';

  public rows: IRow[] = [];

  private rowCount = 6;
  private letterCount = 5;

  private currentLetterIndex: number = 0;
  public currentRowIndex: number = 0;

  public offerSubmit: boolean = false;
  public guessedCorrect: boolean = false;
  public invalidWord: boolean = false;
  public failedAll: boolean = false;

  public usedLetters: string[] = [];

  constructor(private readonly wordService: WordService) {
    this.initAll();
    effect(() => {
      if (this.keyStroke()) {
        this.handleKeystroke(this.keyStroke()!);
      }
    });
  }

  public reset() {
    this.initAll();
  }

  public submitWord(): void {
    const rowIndex = this.currentRowIndex;
    const rowToCheck = this.rows[rowIndex];
    const rowWord = rowToCheck.letters.map((letter) => letter.letter).join('');
    this.invalidWord = !this.wordService.checkWordInList(rowWord);
    if (this.invalidWord) {
      this.offerSubmit = false;
      return;
    }
    this.offerSubmit = false;
    const wordToCheck = this.wordService.getWord();
    const checkedRow = this.wordService.checkWord(rowToCheck, wordToCheck);
    this.guessedCorrect = checkedRow.correctWord || false;
    this.rows = this.rows.map((row) => {
      if (row.id === rowToCheck.id) {
        return checkedRow;
      }
      return row;
    });

    if (this.guessedCorrect) {
      this.wordToGuess = wordToCheck;
    } else {
      if (this.currentLetterIndex > this.rowCount * this.letterCount) {
        this.allRowsTried();
      } else {
        this.currentRowIndex++;
      }
    }
  }

  public initAll(): void {
    this.rows = this.wordService.getRows(this.rowCount, this.letterCount);
    this.currentLetterIndex = 0;
    this.currentRowIndex = 0;
    this.guessedCorrect = false;
    this.offerSubmit = false;
    this.failedAll = false;
    this.invalidWord = false;
  }

  private allRowsTried() {
    this.failedAll = true;
  }

  private setLetter(typedLetter: string, letterId: string): void {
    this.rows = this.getUpdatedRows(this.rows, typedLetter, letterId);
    this.currentLetterIndex++;
    this.setUsedLetter(typedLetter);
    if (this.rowFull()) {
      this.offerSubmit = true;
    }
  }

  private setUsedLetter(letter: string, remove?: boolean): void {
    if (!remove) {
      this.usedLetters = [...this.usedLetters, letter];
    } else {
      this.usedLetters.splice(this.usedLetters.lastIndexOf(letter), 1);
      // To trigger change detection
      this.usedLetters = [...this.usedLetters];
    }
    this.usedLetters.sort((a, b) => a.localeCompare(b));
  }

  private getUpdatedRows(
    rows: IRow[],
    typedLetter: string,
    id: ILetter['id']
  ): IRow[] {
    return rows.map((row, rowIndex) => {
      if (rowIndex !== this.currentRowIndex) {
        return row;
      }
      return {
        ...row,
        letters: row.letters.map((letter) => {
          if (letter.id !== id) {
            return letter;
          }
          return {
            ...letter,
            letter: typedLetter,
          };
        }),
      };
    });
  }

  // TODO: Fix deleting after checking
  private deleteLastLetter(): void {
    this.rows = this.rows.map((row, rowIndex) => {
      if (rowIndex === this.currentRowIndex) {
        return this.wordService.removeLastLetter(row);
      }
      return row;
    });
    this.currentLetterIndex--;
    this.offerSubmit = false;
    this.invalidWord = false;
  }

  private delete(): void {
    if (this.letterOnCurrentRow()) {
      this.setUsedLetter(this.currentLetter(), true);
      this.deleteLastLetter();
    }
  }

  private handleKeyDown(key: string): void {
    if (key === KbKey.backspace) {
      return this.delete();
    }
    // Ignore non letters
    if (key.length !== 1 || /[^a-z]/i.test(key)) {
      return;
    }
    const rowLetterIndex =
      this.currentLetterIndex - this.currentRowIndex * this.letterCount;
    const targetLetterId =
      this.rows[this.currentRowIndex].letters[rowLetterIndex].id;
    this.setLetter(key, targetLetterId);
  }

  private handleKeystroke(keyStroke: string): void {
    this.handleKeyDown(keyStroke);
  }

  private letterOnCurrentRow(): boolean {
    return this.currentLetterIndex - this.currentRowIndex * this.rowCount > 0;
  }

  private currentLetter(): string {
    return this.rows[this.currentRowIndex].letters[this.currentLetterIndex - 1]
      .letter;
  }

  private rowFull(): boolean {
    return (
      this.rows[this.currentRowIndex].letters
        .map((l) => l.letter)
        .filter((l) => l !== '').length === this.letterCount
    );
  }
}

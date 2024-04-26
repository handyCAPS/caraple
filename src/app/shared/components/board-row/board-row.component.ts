import {
  Component,
  EventEmitter,
  HostListener,
  Output,
  input,
} from '@angular/core';
import { ILetter, IRow } from '../board/board.component';
import { WordService } from '../../services/word.service';
import { NgClass } from '@angular/common';
import { KbKey } from '../board/KbKey';
import { KeyboardService } from '../../services/keyboard.service';

@Component({
  selector: 'app-board-row',
  standalone: true,
  imports: [NgClass],
  templateUrl: './board-row.component.html',
  styleUrl: './board-row.component.scss',
})
export class BoardRowComponent {
  isCurrent = input<boolean>();

  isChecked = input<boolean>();

  isGuessed = input<boolean>();

  public row!: IRow;

  private rowLength!: number;

  private wordToGuess: string = '';

  private guessedWord: string = '';

  private rowFull: boolean = false;

  public wordCorrect: boolean = false;

  // TODO: Remove maybe only check if valid?
  @Output() rowFilled = new EventEmitter<void>();

  /**
   * Emits with result of users guess after enter
   */
  @Output() rowGuessed = new EventEmitter<boolean>();

  @HostListener('window:keydown', ['$event'])
  windowKeydown(event: KeyboardEvent) {
    this.handleKeydown(event);
  }

  constructor(
    private readonly wordService: WordService,
    private readonly keyboardService: KeyboardService
  ) {
    this.wordToGuess = this.wordService.getWord();
    this.rowLength = this.wordService.getWordLength();
    this.row = this.wordService.getRows(1, this.rowLength)[0];
  }

  submitWord() {
    this.rowGuessed.emit(true);
    // To color the keyboard
    const guessMap = this.wordService.rowToGuessMap(this.row);
    this.keyboardService.setGuessMap(guessMap);
    // Notify the game
    this.wordCorrect = this.guessedWord === this.wordToGuess;
    this.rowGuessed.emit(this.wordCorrect);
  }

  private handleKeydown(event: KeyboardEvent): void {
    const { key } = event;
    if (this.ignoreKey(key)) {
      return;
    }
    if (key === KbKey.enter) {
      if (this.rowFull) {
        this.submitWord();
      }
    }
    if (key.length === 1) {
      this.setLetter(key);
    }
    if (key === KbKey.backspace) {
      this.row = this.wordService.removeLastLetter(this.row);
    }
  }

  public ignoreKey(key: string): boolean {
    if (key === KbKey.backspace || key === KbKey.enter) {
      return false;
    }
    return key.length !== 1 || /[^a-z]/i.test(key);
  }

  private setLetter(letter: string): void {
    this.row = this.wordService.addLetterToRow(this.row, letter);
    this.guessedWord = this.row.letters
      .map((l) => l.letter)
      .join('')
      .trim();
    this.rowFull = this.guessedWord.length === this.rowLength;

    if (this.rowFull) {
      this.rowFilled.emit();
    }
  }
}

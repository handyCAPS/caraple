import {
  Component,
  EventEmitter,
  HostListener,
  Output,
  input,
} from '@angular/core';
import {  IRow } from '../board/board.component';
import { WordService } from '../../services/word.service';
import { NgClass } from '@angular/common';
import { KbKey } from '../../interfaces/KbKey';
import { KeyboardService } from '../../services/keyboard.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-board-row',
  standalone: true,
  imports: [NgClass],
  templateUrl: './board-row.component.html',
  styleUrl: './board-row.component.scss',
})
export class BoardRowComponent {
  isCurrent = input<boolean>();

  // TODO: Remove
  isChecked = input<boolean>();
  // TODO: Remove
  isGuessed = input<boolean>();

  public row!: IRow;

  private rowLength!: number;

  private rowFull: boolean = false;

  private wordToGuess: string = '';

  public guessedWord: string = '';

  public wordCorrect: boolean = false;

  public wordValid: boolean = true;

  public wordChecked: boolean = false;

  private letterFlips: number = 0;

  public showHoorah: boolean = false;

  /**
   * Emits with result of users guess after enter
   */
  @Output() rowGuessed = new EventEmitter<boolean>();

  @Output() afterLetterFlip = new EventEmitter<void>();

  @HostListener('window:keydown', ['$event'])
  windowKeydown(event: KeyboardEvent) {
    if (!this.isCurrent()) {
      return;
    }

    this.handleKeydown(event.key);
  }

  constructor(
    private readonly wordService: WordService,
    private readonly keyboardService: KeyboardService
  ) {
    this.wordToGuess = this.wordService.getWord();
    this.rowLength = this.wordService.getWordLength();
    this.row = this.wordService.getRow(this.rowLength);
    this.keyboardService
      .keyStrokes()
      .pipe(
        takeUntilDestroyed(),
        filter((_) => !!this.isCurrent())
      )
      .subscribe((key) => {
        this.handleKeydown(key);
      });
  }

  public submitWord(): void {
    this.wordValid = this.wordService.checkWordInList(this.guessedWord);
    if (!this.wordValid) {
      return;
    }
    this.row = this.wordService.checkWord(this.row);
    this.wordChecked = true;
    // Notify the game
    this.wordCorrect = this.wordService.wordIsCorrect(this.guessedWord);
  }

  private emitValues() {
    // To color the keyboard
    const guessMap = this.wordService.rowToGuessMap(this.row);
    this.keyboardService.setGuessMap(guessMap);

    this.afterLetterFlip.emit();
    this.rowGuessed.emit(this.wordCorrect);
  }

  private handleKeydown(key: string): void {
    if (this.ignoreKey(key) || this.wordChecked) {
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
      this.wordValid = true;
      this.rowFull = false;
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
  }

  public letterAnimation(event: AnimationEvent): void {
    if (!event.animationName.includes('letterFlip')) {
      return;
    }
    this.letterFlips++;
    if (this.letterFlips === this.guessedWord.length) {
      this.showHoorah = this.wordCorrect;
      this.emitValues();
    }
  }
}

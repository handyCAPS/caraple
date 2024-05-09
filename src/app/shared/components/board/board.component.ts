import { Component, EventEmitter, Output, effect, input } from '@angular/core';
import { WordService } from '../../services/word.service';
import { KeyboardService } from '../../services/keyboard.service';
import { AlphabeticalPipe } from '../../pipes/alphabetical.pipe';
import { UniquePipe } from '../../pipes/unique.pipe';
import { NgClass } from '@angular/common';
import { BoardRowComponent } from '../board-row/board-row.component';
import { GamesService } from '../../services/games.service';
import { ClockService } from '../../services/clock.service';
import { filter } from 'rxjs';
import { IGame } from '../../interfaces/game.interface';

export interface ILetter {
  id: string;
  letter: string;
  correctLetter?: boolean;
  correctSpace?: boolean;
}

export interface IRow {
  letters: ILetter[];
  guessed?: boolean;
  correctWord?: boolean;
}

export interface IBoardRow {
  index: number;
  active: boolean;
  guessed?: boolean;
  correctWord?: boolean;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  standalone: true,
  imports: [UniquePipe, AlphabeticalPipe, NgClass, BoardRowComponent],
})
export class BoardComponent {
  @Output() started = new EventEmitter<void>();

  @Output() finished = new EventEmitter<boolean>();

  public restart = input<boolean>();

  private rowCount: number = 6;
  public wordToGuess: string = '';
  private correctRowIndex: number = 0;

  public guessedCorrect: boolean = false;
  public invalidWord: boolean = false;
  public failedAll: boolean = false;

  public boardRows: IBoardRow[] = [
    {
      active: true,
      index: 0,
    },
  ];

  constructor(
    private readonly wordService: WordService,
    private readonly gamesService: GamesService,
    private readonly clockService: ClockService
  ) {
    this.initAll();
    effect(() => {
      if (this.restart()) {
        this.initAll();
      }
    });
    this.clockService
      .getClockTime()
      .pipe(filter((time) => time !== null && this.guessedCorrect))
      .subscribe((time) => {
        this.gamesService.addGame(this.getGame(time!));
      });
  }

  public reset() {
    this.initAll();
  }

  public initAll(): void {
    this.boardRows = this.getBoardRows(this.rowCount);
    this.guessedCorrect = false;
    this.boardRows[0].active = true;
    this.failedAll = false;
    this.invalidWord = false;
    this.started.emit();
  }

  public rowGuessed(rowIndex: number, correct: boolean): void {
    const nextRowIndex = rowIndex + 1;
    this.guessedCorrect = correct;
    if (nextRowIndex === 1) {
      this.started.emit();
    }
    if (nextRowIndex === this.rowCount) {
      this.failedAll = !correct;
      this.invalidWord = !correct;
      this.wordToGuess = this.wordService.getWord();
      this.finished.emit(correct);
    }
    if (correct) {
      this.correctRowIndex = rowIndex;
      this.finished.emit(correct);
      if (rowIndex === 0) {
        this.gamesService.addGame(this.getGame());
      }
    }
    if (!correct) {
      this.boardRows = this.boardRows.map((row, index) => {
        if (nextRowIndex === index) {
          return {
            ...row,
            active: true,
          };
        }
        return {
          ...row,
          active: false,
        };
      });
    }
  }

  private getBoardRows(count: number): IBoardRow[] {
    console.log('Getting boardrows');
    return [...new Array(count)].map((n, index) => ({
      active: false,
      index,
    }));
  }

  private getGame(time?: number): IGame {
    const word = this.wordService.getWord();
    return {
      guesses: this.correctRowIndex + 1,
      date: new Date().valueOf(),
      timeSpent: time ?? 0,
      word: word,
      user: {
        id: 'testId',
        dateAdded: new Date().valueOf(),
        name: 'Tim',
      },
    };
  }
}

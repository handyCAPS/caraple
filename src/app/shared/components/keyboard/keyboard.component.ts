import { JsonPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { KbKey } from '../../interfaces/KbKey';
import { KeyboardService } from '../../services/keyboard.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

export interface IGuessedKey {
  key: string;
  correctLetter?: boolean;
  correctSpace?: boolean;
}

export interface IKeyUseMap {
  [key: string]: 1 | 2 | 3;
}

@Component({
  selector: 'cpx-keyboard',
  standalone: true,
  imports: [JsonPipe, NgClass],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss',
})
export class KeyboardComponent {
  @Output() keyStroke = new EventEmitter<string>();

  @Output() enter = new EventEmitter<void>();

  @Output() backspace = new EventEmitter<void>();

  public keyBoardKey = KbKey;

  public keyGuesses: IKeyUseMap = {};

  public keys: string[][] = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    [KbKey.enter, 'z', 'x', 'c', 'v', 'b', 'n', 'm', KbKey.backspace],
  ];

  constructor(private readonly keyboardService: KeyboardService) {
    this.keyboardService
      .getGuessMap()
      .pipe(takeUntilDestroyed())
      .subscribe((map) => {
        this.keyGuesses = { ...this.keyGuesses, ...map };
      });
  }

  public stroke(key: string): void {
    if (key === KbKey.backspace) {
      this.backspace.emit();
    }
    if (key === KbKey.enter) {
      this.enter.emit();
    }
    this.keyStroke.emit(key);
    this.keyboardService.setKeystroke(key);
  }
}

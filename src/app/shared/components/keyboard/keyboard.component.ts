import { JsonPipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { KbKey } from '../board/KbKey';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss',
})
export class KeyboardComponent {
  @Output() keyStroke = new EventEmitter<string>();

  @Output() enter = new EventEmitter<void>();

  @Output() backspace = new EventEmitter<void>();

  public keys: string[][] = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    [KbKey.enter, 'z', 'x', 'c', 'v', 'b', 'n', 'm', KbKey.backspace],
  ];
}

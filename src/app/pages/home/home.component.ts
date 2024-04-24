import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { KeyboardComponent } from '../../shared/components/keyboard/keyboard.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, KeyboardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public keyStroke: string = '';
  public enter: boolean = false;
  public backspace: boolean = false;
}

import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { KeyboardComponent } from '../../shared/components/keyboard/keyboard.component';
import { BoardComponent } from '../../shared/components/board/board.component';
import {
  ClockComponent,
  IAfterDates,
} from '../../shared/components/clock/clock.component';
import { ClockService } from '../../shared/services/clock.service';
import { ScoreboardComponent } from '../../shared/components/scoreboard/scoreboard.component';
import { GamesService } from '../../shared/services/games.service';
import { take } from 'rxjs';

@Component({
  selector: 'cpx-home',
  standalone: true,
  imports: [
    SharedModule,
    KeyboardComponent,
    BoardComponent,
    ScoreboardComponent,
    ClockComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public runClock: boolean = false;

  public finalTime: number = 0;

  public restart: boolean = false;

  constructor(
    private readonly clockService: ClockService,
    private readonly gameService: GamesService
  ) {
    this.gameService.afterGame().pipe(take(1)).subscribe();
  }

  public startTheClock() {
    if (!this.runClock) {
      this.runClock = true;
    }
  }

  public setFinalTime(dates: IAfterDates): void {
    this.finalTime = dates.end.valueOf() - dates.start.valueOf();
    this.clockService.setClockTime(this.finalTime);
  }

  public afterBoardGuessed(correct: boolean): void {
    this.runClock = false;
    // TODO: Check if clock should show top 10 finish
  }
}

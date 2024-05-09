import {
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  effect,
  input,
} from '@angular/core';
import { ZeropadPipe } from '../../pipes/zeropad.pipe';
import { Subject, filter, interval, takeUntil } from 'rxjs';
import { IDateValues, datesDiff } from '../../helpers/helpers';
import { NgClass } from '@angular/common';
import { GamesService } from '../../services/games.service';

export interface IAfterDates {
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [NgClass, ZeropadPipe],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.scss',
})
export class ClockComponent implements OnDestroy {
  public run = input.required<boolean>();

  @Output() afterTime = new EventEmitter<IAfterDates>();

  public time: IDateValues = {
    milliseconds: 0,
    minutes: 0,
    seconds: 0,
  };

  private startDate!: Date;

  private endDate?: Date;

  public goldSilverBronze = {
    gold: 0,
    silver: 0,
    bronze: 0,
  };

  public isGold: boolean = true;
  public isSilver: boolean = false;
  public isBronze: boolean = false;

  public isPastMax: boolean = false;

  private lowHighScore?: number;

  private destroy$ = new Subject<boolean>();

  constructor(private readonly gamesService: GamesService) {
    effect(() => {
      if (this.run()) {
        this.startInterval();
      } else {
        if (this.endDate) {
          this.destroySubs();
          this.afterTime.emit({
            start: this.startDate,
            end: this.endDate!,
          });
          this.time = datesDiff(this.startDate, this.endDate);
        }
      }
    });
    this.getHighScore();
  }

  ngOnDestroy() {
    this.destroySubs(true);
  }

  private startInterval(): void {
    this.startDate = new Date();
    // Uneven number looks more interesting
    const intervalTime = 93;
    interval(intervalTime)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.endDate = new Date();
        const timeSpent = this.endDate.valueOf() - this.startDate.valueOf();
        const time = datesDiff(this.startDate, this.endDate);
        time.milliseconds = Math.round(time.milliseconds);
        if (this.lowHighScore !== undefined) {
          this.setTopTimes(timeSpent);
        }
        this.time = time;
      });
  }

  private destroySubs(kill?: boolean): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    if (!kill) {
      this.destroy$ = new Subject<boolean>();
    }
  }

  private getHighScore() {
    this.gamesService
      .subToGames()
      .pipe(filter((games) => !!games))
      .subscribe((highscores) => {
        this.goldSilverBronze = {
          gold: highscores![0].timeSpent,
          silver: highscores![1].timeSpent,
          bronze: highscores![2].timeSpent,
        };
        this.lowHighScore = highscores![highscores!.length - 1].timeSpent;
      });
  }

  private setTopTimes(time: number): void {
    if (this.isPastMax) {
      return;
    }
    const { gold, silver, bronze } = this.goldSilverBronze;
    if (time <= gold) {
      this.isGold = true;
      return;
    }
    this.isGold = false;
    if (time <= silver) {
      this.isSilver = true;
      return;
    }
    this.isSilver = false;
    this.isBronze = time <= bronze;
    this.isPastMax = time > this.lowHighScore!;
  }
}

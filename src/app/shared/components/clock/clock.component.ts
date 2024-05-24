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
import { RankPrizeComponent } from '../rank-prize/rank-prize.component';

export interface IAfterDates {
  start: Date;
  end: Date;
}

@Component({
  selector: 'cpx-clock',
  standalone: true,
  imports: [NgClass, ZeropadPipe, RankPrizeComponent],
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

  public ranking: number | null = null;

  public goldSilverBronze: {
    gold: number | null;
    silver: number | null;
    bronze: number | null;
  } = {
    gold: null,
    silver: 0,
    bronze: 0,
  };

  public isGold: boolean = true;
  public isSilver: boolean = false;
  public isBronze: boolean = false;

  private topThreeSet: boolean = false;

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
          const timeInMs = this.endDate.valueOf() - this.startDate.valueOf();
          this.time = datesDiff(this.startDate, this.endDate);
          this.ranking = this.gamesService.getRanking(timeInMs);
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
        if (!this.topThreeSet && !this.isPastMax) {
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
      .pipe(filter((games) => games !== null && games?.length > 0))
      .subscribe((highscores) => {
        this.goldSilverBronze = {
          gold: highscores![0]?.timeSpent ?? 0,
          silver: highscores![1]?.timeSpent ?? null,
          bronze: highscores![2]?.timeSpent ?? null,
        };
        const highscoreLength = highscores?.length || 0;
        if (highscoreLength > 3) {
          this.lowHighScore = highscores![highscores!.length - 1].timeSpent;
        }
      });
  }

  /**
   * Called every interval until all are set
   */
  private setTopTimes(time: number): void {
    const { gold, silver, bronze } = this.goldSilverBronze;

    if (time <= (gold ?? 0)) {
      this.isGold = true;
      return;
    }
    if (silver !== null && time <= silver) {
      this.isGold = false;
      this.isSilver = true;
      return;
    }
    if (bronze === null) {
      this.topThreeSet = true;
      return;
    }
    this.isSilver = false;
    this.isBronze = time <= bronze;
    if (this.lowHighScore) {
      if (time > this.lowHighScore) {
        this.isPastMax = true;
        this.topThreeSet = true;
      }
    } else {
      this.topThreeSet = true;
    }
  }
}

import {
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  effect,
  input,
} from '@angular/core';
import { ZeropadPipe } from '../../pipes/zeropad.pipe';
import { Subject, interval, takeUntil } from 'rxjs';
import { IDateValues, datesDiff } from '../../helpers/helpers';
import { NgClass } from '@angular/common';

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

  private destroy$ = new Subject<boolean>();

  constructor() {
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
        const time = datesDiff(this.startDate, this.endDate);
        time.milliseconds = Math.round(time.milliseconds);
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
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

type TClockValue = number | null;

@Injectable({
  providedIn: 'root',
})
export class ClockService {
  private clockValue: TClockValue = null;

  private readonly clockValueSub = new BehaviorSubject<TClockValue>(
    this.clockValue
  );

  constructor() {}

  public setClockTime(time: number): void {
    this.clockValue = time;
    this.clockValueSub.next(time);
  }

  public getClockTime(): Observable<TClockValue> {
    return this.clockValueSub.asObservable();
  }
}

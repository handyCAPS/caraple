import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, filter, map } from 'rxjs';
import {
  IGuessedKey,
  IKeyUseMap,
} from '../components/keyboard/keyboard.component';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService {
  private keystrokeSubject = new BehaviorSubject<string>('');

  private guessMapSubject = new Subject<IKeyUseMap>();

  constructor() {}

  public keyStrokes(): Observable<string> {
    return this.keystrokeSubject.asObservable();
  }

  public setKeystroke(key: string): void {
    this.keystrokeSubject.next(key);
  }

  public setGuessMap(map: IKeyUseMap): void {
    this.guessMapSubject.next(map);
  }

  public getGuessMap(): Observable<IKeyUseMap> {
    return this.guessMapSubject.asObservable();
  }
}

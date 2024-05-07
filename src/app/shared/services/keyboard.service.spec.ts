import { TestBed } from '@angular/core/testing';

import { KeyboardService } from './keyboard.service';
import { take } from 'rxjs';
import { IKeyUseMap } from '../components/keyboard/keyboard.component';

describe('KeyboardService', () => {
  let service: KeyboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit a value if a keystroke is set', (done) => {
    const stroke = 'a';
    service.setKeystroke(stroke);
    service
      .keyStrokes()
      .pipe(take(1))
      .subscribe((strk) => {
        expect(strk).toBe(stroke);
        done();
      });
  });

  it('emits a value if a map is guessed', (done) => {
    const testMap: IKeyUseMap = {
      a: 1,
      b: 3,
    };
    service
      .getGuessMap()
      .pipe(take(1))
      .subscribe((map) => {
        expect(map).toEqual(testMap);
        done();
      });
    service.setGuessMap(testMap);
  });
});

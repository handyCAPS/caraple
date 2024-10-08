import { IKeyUseMap, KeyboardComponent } from './keyboard.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { testId } from '../../../testing/helpers';
import { KbKey } from '../../interfaces/KbKey';
import { KeyboardService } from '../../services/keyboard.service';

describe('KeyboardComponent', () => {
  beforeEach(() => {
    return MockBuilder(KeyboardComponent).keep(KeyboardService);
  });

  describe('Keyboard', () => {
    it('should create', () => {
      const fixture = MockRender(KeyboardComponent);
      const component = fixture.point.componentInstance;
      expect(component).toBeTruthy();
    });

    it('has 26 keys', () => {
      const fixture = MockRender(KeyboardComponent);
      const keys = ngMocks.findAll(testId('key'));
      expect(keys.length).toBe(26);
    });

    it('has 1 enter key', () => {
      const fixture = MockRender(KeyboardComponent);
      const enterKeys = ngMocks.findAll(testId('key-enter'));
      expect(enterKeys.length).toBe(1);
    });

    it('has 1 delete key', () => {
      const fixture = MockRender(KeyboardComponent);
      const deleteKeys = ngMocks.findAll(testId('key-backspace'));
      expect(deleteKeys.length).toBe(1);
    });
  });

  describe('Ouputs', () => {
    it('emit key when pressed', () => {
      const fixture = MockRender(KeyboardComponent);
      const component = fixture.point.componentInstance;
      const aKey = ngMocks.find(fixture, dataKey('a'));
      spyOn(component.keyStroke, 'emit');
      ngMocks.click(aKey);
      expect(component.keyStroke.emit).toHaveBeenCalledWith('a');
      const zKey = ngMocks.find(fixture, dataKey('z'));
      ngMocks.click(zKey);
      expect(component.keyStroke.emit).toHaveBeenCalledWith('z');
    });

    it('emits Enter when enter pressed', () => {
      const fixture = MockRender(KeyboardComponent);
      const component = fixture.point.componentInstance;
      const enterKey = ngMocks.find(testId('key-enter'));
      spyOn(component.enter, 'emit');
      spyOn(component.keyStroke, 'emit');
      ngMocks.click(enterKey);
      expect(component.enter.emit).toHaveBeenCalled();
      expect(component.keyStroke.emit).toHaveBeenCalledWith(KbKey.enter);
    });

    it('emits Backspace when backspace pressed', () => {
      const fixture = MockRender(KeyboardComponent);
      const component = fixture.point.componentInstance;
      const backspaceKey = ngMocks.find(testId('key-backspace'));
      spyOn(component.backspace, 'emit');
      spyOn(component.keyStroke, 'emit');
      ngMocks.click(backspaceKey);
      expect(component.backspace.emit).toHaveBeenCalled();
      expect(component.keyStroke.emit).toHaveBeenCalledWith(KbKey.backspace);
    });
  });

  describe('Keystroke service', () => {
    it('gives guessed keys 1, 2 or 3 value', () => {
      const fixture = MockRender(KeyboardComponent);
      const component = fixture.point.componentInstance;
      const service = ngMocks.findInstance(KeyboardService);
      const testMap: IKeyUseMap = {
        a: 1,
        b: 2,
      };
      service.setGuessMap(testMap);
      fixture.detectChanges();
      expect(component.keyGuesses['a']).toBe(testMap['a']);
      expect(component.keyGuesses['b']).toBe(testMap['b']);
      expect(component.keyGuesses['z']).toBeUndefined();
      const testMapSecond: IKeyUseMap = {
        c: 3,
        d: 1,
      };
      service.setGuessMap(testMapSecond);
      fixture.detectChanges();
      expect(component.keyGuesses['a']).toBe(testMap['a']);
      expect(component.keyGuesses['b']).toBe(testMap['b']);
      expect(component.keyGuesses['c']).toBe(testMapSecond['c']);
      expect(component.keyGuesses['d']).toBe(testMapSecond['d']);
      expect(component.keyGuesses['z']).toBeUndefined();
    });
  });
});

function dataKey(key: string): string {
  return `[data-key="${key}"]`;
}

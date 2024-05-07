import { IDateValues, countLetters, datesDiff } from './helpers';

describe('Helpers', () => {
  describe('countLetters', () => {
    it('counts the occurences of a letter in a string', () => {
      const testString = 'BOOYAH';
      const testLetter = 'o';
      expect(countLetters(testLetter, testString)).toBe(2);
    });

    it('counts the occurences of a letter in a string[]', () => {
      const testArray = ['C', 'H', 'O', 'C', 'C', 'Y'];

      const testLetter = 'c';
      expect(countLetters(testLetter, testArray)).toBe(3);
    });
  });

  describe('datesDiff', () => {
    it('returns an object with the milliseconds between two dates', () => {
      const testDateFirst = new Date();
      const testResult: IDateValues = {
        minutes: 12,
        seconds: 50,
        milliseconds: 20,
      };
      testDateFirst.setMinutes(testResult.minutes);
      testDateFirst.setSeconds(testResult.seconds);
      testDateFirst.setMilliseconds(testResult.milliseconds);

      const testDateLast = new Date();
      const offsetData: IDateValues = {
        minutes: 25,
        seconds: 10,
        milliseconds: 400,
      };
      testDateLast.setMinutes(testResult.minutes + offsetData.minutes);
      testDateLast.setSeconds(testResult.seconds + offsetData.seconds);
      testDateLast.setMilliseconds(
        testResult.milliseconds + offsetData.milliseconds
      );
      const actual = datesDiff(testDateFirst, testDateLast);
      expect(actual).toEqual(offsetData);
    });
  });
});

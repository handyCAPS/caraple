import { ZeropadPipe } from './zeropad.pipe';

describe('ZeropadPipe', () => {
  it('create an instance', () => {
    const pipe = new ZeropadPipe();
    expect(pipe).toBeTruthy();
  });

  it('returns a string padded with leading 0s', () => {
    const pipe = new ZeropadPipe();
    const testNumber = 1;
    const expected = '01';
    const actual = pipe.transform(testNumber);
    expect(actual).toBe(expected);
  });

  it('returns a custom string length', () => {
    const pipe = new ZeropadPipe();
    const testNumber = 1;
    const expected = '001';
    const actual = pipe.transform(testNumber, 3);
    expect(actual).toBe(expected);
  });

  it('retains everything up to the max string length', () => {
    const pipe = new ZeropadPipe();
    const testNumber = 254;
    const expected = '254';
    const actual = pipe.transform(testNumber, 3);
    expect(actual).toBe(expected);
  });
});

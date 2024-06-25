import { TimeStringPipe } from './time-string.pipe';

fdescribe('TimeStringPipe', () => {
  const milliseconds = 1;
  const seconds = 1000 * milliseconds;
  const minutes = 60 * seconds;

  it('creates an instance', () => {
    const pipe = new TimeStringPipe();
    expect(pipe).toBeTruthy();
  });

  it('changes a number of milliseconds into a time string', () => {
    const pipe = new TimeStringPipe();
    const testNumber = 16 * minutes + 15 * seconds + 120 * milliseconds;
    const expected = '16:15:120';
    expect(pipe.transform(testNumber)).toBe(expected);
  });

  it('trims any minutes or seconds that are 0', () => {
    const pipe = new TimeStringPipe();
    const testNumber = 12 * seconds + 120 * milliseconds;
    const expected = '12:120';
    expect(pipe.transform(testNumber, true)).toBe(expected);
  });

  it('trims any leading 0 from minutes or seconds', () => {
    const pipe = new TimeStringPipe();
    const testNumber = 2 * seconds + 254 * milliseconds;
    const expected = '2:254';
    expect(pipe.transform(testNumber, true)).toBe(expected);
  });

  it('doesnt trim seconds if minutes are not 0', () => {
    const pipe = new TimeStringPipe();
    const testNumber = 3 * minutes + 95 * milliseconds;
    const expected = '3:00:095';
    expect(pipe.transform(testNumber, true)).toBe(expected);
  });

  it('never trims milliseconds', () => {
    const pipe = new TimeStringPipe();
    const testNumber = 50 * milliseconds;
    const expected = '0.050';
    expect(pipe.transform(testNumber, true)).toBe(expected);
  });

  it('Adds a 0. if no minutes or seconds', () => {
    const pipe = new TimeStringPipe();
    const testNumber = 56 * milliseconds;
    const expected = '0.056';
    expect(pipe.transform(testNumber, true)).toBe(expected);
  });

});

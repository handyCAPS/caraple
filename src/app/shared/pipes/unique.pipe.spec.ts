import { UniquePipe } from './unique.pipe';

describe('UniquePipe', () => {
  it('create an instance', () => {
    const pipe = new UniquePipe();
    expect(pipe).toBeTruthy();
  });

  it('returns an array without duplicates', () => {
    const pipe = new UniquePipe();
    const testArray = 'abbcccdd'.split('');
    expect(pipe.transform(testArray)).toEqual(['a', 'b', 'c', 'd']);
  });
});

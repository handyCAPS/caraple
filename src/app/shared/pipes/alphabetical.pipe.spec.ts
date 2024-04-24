import { AlphabeticalPipe } from './alphabetical.pipe';

describe('AlphabeticalPipe', () => {
  it('create an instance', () => {
    const pipe = new AlphabeticalPipe();
    expect(pipe).toBeTruthy();
  });

  it('sorts array alphabeticaly', () => {
    const pipe = new AlphabeticalPipe();
    expect(pipe.transform('idgaf'.split(''))).toEqual('adfgi'.split(''));
  });
});

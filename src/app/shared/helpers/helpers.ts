export function countLetters(
  letter: string,
  target: string | string[]
): number {
  const testString = Array.isArray(target) ? target.join('') : target;

  return testString.match(new RegExp(letter, 'gi'))?.length ?? 0;
}

export interface IDateValues {
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export function msToValues(ms: number): IDateValues {
  const secInMill = 1000;
  const minInMill = 60 * secInMill;
  const milliseconds = ms % secInMill;
  const seconds = ((ms - milliseconds) % minInMill) / secInMill;
  const minutes = Math.floor((ms - seconds - milliseconds) / minInMill);
  return {
    minutes,
    milliseconds,
    seconds,
  };
}

export function datesDiff(dateFirst: Date, dateLast: Date): IDateValues {
  const msDiff = dateLast.valueOf() - dateFirst.valueOf();
  return msToValues(msDiff);
}

export function zeroPad(toPad: string | number, padding: number = 2): string {
  return ('00' + toPad).slice(-padding);
}

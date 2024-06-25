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

export function toTimeString(ms: number, trim?: boolean) {
  const { milliseconds, seconds, minutes } = msToValues(ms);
  const minutesString = zeroPad(minutes, 2);
  const secondsString = zeroPad(seconds, 2);
  const msString = zeroPad(milliseconds, 3);
  const timeString = `${minutesString}:${secondsString}:${msString}`;
  if (trim) {
    return timeString
      .split(':')
      .filter((part, i) => {
        // if seconds are 00, they should stay if minutes are not 00
        if (part === '00' && minutesString !== '00') {
          return true;
        }
        return part !== '00';
      })
      .map((part, i, arr) => {
        if (arr.length === 1) {
          // Add a leading 0 if its only milliseconds
          return '0.' + part;
        }
        if (part.length === 3 || (arr.length === 3 && i == 1)) {
          // Never trim milliseconds
          // When it has minutes, dont trim the seconds
          return part;
        }
        // Remove any leading 0s from minutes and seconds
        return part.replace(/^0/, '');
      })
      .join(':');
  }
  return timeString;
}

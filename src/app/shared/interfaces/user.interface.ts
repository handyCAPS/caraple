import { IGame } from './game.interface';

export interface IUser<DateType extends Date | number = number> {
  id: string;
  name: string;
  dateAdded: DateType;
  currentStreak?: number;
  maxStreak?: number;
}

import { IUser } from "./user.interface";

export interface IGame<DateType extends Date | number = number> {
  id: string;
  word: string;
  guesses: number;
  timeSpent: number; // Milliseconds
  date: DateType;
  user: IUser;
}

import { IRow } from "../shared/components/board/board.component";

export class GameMediator {
  private gameTime?: number;

  private guessedCorrect?: boolean;

  private currentGuess?: IRow;

  public setGameTime(time: number): void {
    this.gameTime = time;
  }

  public setGuessed(correct: boolean): void {
    this.guessedCorrect = correct;
  }
}

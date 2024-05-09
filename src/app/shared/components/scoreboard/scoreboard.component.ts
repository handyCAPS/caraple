import { Component } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { IGame } from '../../interfaces/game.interface';
import { Observable } from 'rxjs';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { DateValuesPipe } from '../../pipes/date-values.pipe';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [AsyncPipe, DateValuesPipe, UpperCasePipe],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss',
})
export class ScoreboardComponent {
  public games$!: Observable<IGame[] | null>;

  public added: boolean = false;
  constructor(private readonly gamesService: GamesService) {
    this.games$ = this.gamesService
      .subToGames();
  }
}

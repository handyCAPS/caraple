export enum EDBKeys {
  db = 'caraple',
  games = 'games',
  users = 'users',
  streak = 'streak',
}

export enum EGamesDBKey {
  word = 'word',
  guesses = 'guesses',
  timeSpent = 'timeSpent',
  date = 'date',
  user = 'user',
}

export enum EStreakDBKey {
  user = 'user',
  count = 'count',
}

export interface IStreakDb {
  id: number;
  count: number;
  user?: number;
}

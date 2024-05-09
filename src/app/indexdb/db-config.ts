import { DBConfig } from 'ngx-indexed-db';
import { EDBKeys, EGamesDBKey } from './db-keys';

export const dbConfig: DBConfig = {
  name: EDBKeys.db,
  version: 2,
  objectStoresMeta: [
    {
      store: EDBKeys.games,
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        {
          name: EGamesDBKey.word,
          keypath: EGamesDBKey.word,
          options: { unique: false },
        },
        {
          name: EGamesDBKey.guesses,
          keypath: EGamesDBKey.guesses,
          options: { unique: false },
        },
        {
          name: EGamesDBKey.timeSpent,
          keypath: EGamesDBKey.timeSpent,
          options: { unique: false },
        },
        {
          name: EGamesDBKey.date,
          keypath: EGamesDBKey.date,
          options: { unique: false },
        },
        {
          name: EGamesDBKey.user,
          keypath: EGamesDBKey.user,
          options: { unique: false },
        },
      ],
    },
  ],
};

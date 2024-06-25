import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { dbConfig } from './indexdb/db-config';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom([NgxIndexedDBModule.forRoot(dbConfig)]),
    provideCharts(withDefaultRegisterables()), //provideCharts({ registerables: [BarController, Legend, Colors] })
  ],
};

import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  isDevMode,
  provideCheckNoChangesConfig,
} from '@angular/core';
import {
  provideRouter,
  withViewTransitions,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withPreloading(PreloadAllModules), withViewTransitions()),
    // enable extra checks in dev mode only
    ...(isDevMode()
      ? [
          provideCheckNoChangesConfig({
            exhaustive: true,
            interval: 3_000,
          }),
        ]
      : []),
  ],
};

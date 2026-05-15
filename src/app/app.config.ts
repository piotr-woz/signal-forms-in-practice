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
import { provideSignalFormsConfig } from '@angular/forms/signals';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withPreloading(PreloadAllModules), withViewTransitions()),
    ...(isDevMode()
      ? [
          // enable extra checks in dev mode only
          provideCheckNoChangesConfig({
            exhaustive: true,
            interval: 3_000,
          }),
        ]
      : []),
    provideSignalFormsConfig({
      classes: {
        'is-invalid': (field) => field.state().invalid() && field.state().touched(),
      },
    }),
  ],
};

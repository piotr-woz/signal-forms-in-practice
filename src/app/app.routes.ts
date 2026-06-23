import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./features/home/home'),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'example1',
    loadComponent: () => import('./features/example1/example1'),
  },
  {
    path: 'example2',
    loadComponent: () => import('./features/example2/example2'),
  },
  {
    path: 'example3',
    loadComponent: () => import('./features/example3/example3'),
  },
];

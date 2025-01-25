import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'nested',
    loadComponent: () => import('./nested/nested.component').then(c => c.NestedComponent)
  }
];

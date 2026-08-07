import { Routes } from '@angular/router';
import { HomeRoutes } from './features/home/home.routes';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        children: HomeRoutes,
    },
    { path: '**', redirectTo: '' }
];

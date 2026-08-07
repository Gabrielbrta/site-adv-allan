import { Routes } from "@angular/router";
import { HomeComponent } from "./home.component";
import { MainContentComponent } from "../main-content/main-content.component";

export const HomeRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('../main-content/main-content.component').then(c => c.MainContentComponent),
    },
    {
        path: 'sobre',
        loadComponent: () => import('../main-content/main-content.component').then(c => c.MainContentComponent),
    },
    {
        path: 'calculadora-trabalhista',
        loadComponent: () => import('../main-content/main-content.component').then(c => c.MainContentComponent),
    },
    {
        path: 'areas-de-atuacao',
        loadComponent: () => import('../main-content/main-content.component').then(c => c.MainContentComponent),
    },
    {
        path: 'contato',
        loadComponent: () => import('../main-content/main-content.component').then(c => c.MainContentComponent),
    },
]
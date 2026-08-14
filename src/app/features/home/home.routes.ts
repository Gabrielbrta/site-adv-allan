import { Routes } from "@angular/router";

export const HomeRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('../main-content/main-content.component').then(c => c.MainContentComponent),
    },
    {
        path: 'sobre',
        loadComponent: () => import('../sobre/sobre.component').then(c => c.SobreComponent),
    },
    {
        path: 'calculadora-trabalhista',
        loadComponent: () => import('../calculadora-trabalhista/calculadora-trabalhista.component').then(c => c.CalculadoraTrabalhistaComponent),
    },
    {
        path: 'areas-de-atuacao',
        loadComponent: () => import('../areas-de-atuacao/areas-de-atuacao.component').then(c => c.AreasDeAtuacaoComponent),
    },
    {
        path: 'contato',
        loadComponent: () => import('../contato/contato.component').then(c => c.ContatoComponent),
    },
]
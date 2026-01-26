import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        title: 'Amazonas Jungle - Inicio',
        loadComponent: () => import('./home/home').then(m => m.HomeComponent)
    },
    {
        path: 'amazonia',
        loadChildren: () => import('./features/amazonia.routes').then(m => m.AMAZONIA_ROUTES)
    },
    {
        path: '**',
        redirectTo: ''
    }
];

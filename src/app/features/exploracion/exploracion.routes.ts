import { Routes } from '@angular/router';

export const EXPLORACION_ROUTES: Routes = [
    {
        path: 'historia',
        loadComponent: () => import('./historia/historia.component').then(m => m.HistoriaComponent)
    },
    {
        path: '',
        redirectTo: 'historia',
        pathMatch: 'full'
    }
];


import { Routes } from '@angular/router';

export const RESERVAS_ROUTES: Routes = [
    {
        path: 'mapa',
        loadComponent: () => import('./mapa/mapa.component').then(m => m.MapaComponent),
        title: 'Mapa de la Reserva'
    },
    {
        path: '',
        redirectTo: 'mapa',
        pathMatch: 'full'
    }
];

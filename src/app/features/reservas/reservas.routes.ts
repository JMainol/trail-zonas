
import { Routes } from '@angular/router';

export const RESERVAS_ROUTES: Routes = [
    {
        path: 'mapa',
        loadComponent: () => import('./mapa/mapa.component').then(m => m.MapaComponent),
        title: 'Mapa interactivo de reservas naturales de la Amazonía',
        data: { description: 'Explora en un mapa interactivo los principales parques nacionales y reservas naturales de la Amazonía en Perú, Brasil, Bolivia, Colombia, Ecuador y Venezuela.' }
    },
    {
        path: '',
        redirectTo: 'mapa',
        pathMatch: 'full'
    }
];

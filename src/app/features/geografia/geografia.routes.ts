
import { Routes } from '@angular/router';
import { GeografiaComponent } from './geografia.component';

export const GEOGRAFIA_ROUTES: Routes = [
    {
        path: '',
        component: GeografiaComponent,
        children: [
            {
                path: 'rio-afluentes',
                loadComponent: () => import('./rio-afluentes/rio-afluentes.component').then(m => m.RioAfluentesComponent),
                title: 'El Río Amazonas y Afluentes'
            },
            {
                path: 'clima-estacionalidad',
                loadComponent: () => import('./clima-estacionalidad/clima-estacionalidad.component').then(m => m.ClimaEstacionalidadComponent),
                title: 'Clima y Estacionalidad'
            },
            {
                path: 'geologia-suelos',
                loadComponent: () => import('./geologia-suelos/geologia-suelos.component').then(m => m.GeologiaSuelosComponent),
                title: 'Geología y Suelos'
            },
            {
                path: '',
                redirectTo: 'rio-afluentes',
                pathMatch: 'full'
            }
        ]
    }
];

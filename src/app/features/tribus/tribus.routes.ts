
import { Routes } from '@angular/router';
import { TribusComponent } from './tribus.component';

export const TRIBUS_ROUTES: Routes = [
    {
        path: '',
        component: TribusComponent,
        children: [
            {
                path: 'etnias',
                title: 'Etnias de la Amazonía',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./etnias/etnias.component').then(m => m.EtniasComponent),
                    },
                    {
                        path: 'waorani',
                        loadComponent: () => import('./etnias/waorani/waorani.component').then(m => m.WaoraniComponent),
                        title: 'Tribu Waorani'
                    },
                    {
                        path: 'kayapo',
                        loadComponent: () => import('./etnias/kayapo/kayapo.component').then(m => m.KayapoComponent),
                        title: 'Tribu Kayapó'
                    }
                ]
            },
            {
                path: 'etnias-regiones',
                loadComponent: () => import('./etnias-regiones/etnias-regiones.component').then(m => m.EtniasRegionesComponent),
                title: 'Etnias Principales y Regiones'
            },
            {
                path: 'cultura-sociedad',
                loadComponent: () => import('./cultura-sociedad/cultura-sociedad.component').then(m => m.CulturaSociedadComponent),
                title: 'Cultura y Sociedad'
            },
            {
                path: 'conocimiento-ancestral',
                loadComponent: () => import('./conocimiento-ancestral/conocimiento-ancestral.component').then(m => m.ConocimientoAncestralComponent),
                title: 'Conocimiento Ancestral'
            },
            {
                path: 'desafios-supervivencia',
                loadComponent: () => import('./desafios-supervivencia/desafios-supervivencia.component').then(m => m.DesafiosSupervivenciaComponent),
                title: 'Desafíos y Supervivencia'
            },
            {
                path: '',
                redirectTo: 'etnias-regiones',
                pathMatch: 'full'
            }
        ]
    }
];

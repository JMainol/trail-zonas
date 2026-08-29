
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
                        data: { description: 'Descubre las etnias indígenas que habitan y protegen la selva amazónica.' },
                        loadComponent: () => import('./etnias/etnias.component').then(m => m.EtniasComponent),
                    },
                    {
                        path: 'waorani',
                        data: { description: 'Conoce a la tribu Waorani, legendarios guerreros de la selva.' },
                        loadComponent: () => import('./etnias/waorani/waorani.component').then(m => m.WaoraniComponent),
                        title: 'Tribu Waorani'
                    },
                    {
                        path: 'kayapo',
                        data: { description: 'Descubre a los Kayapó, guardianes del Amazonas en Brasil.' },
                        loadComponent: () => import('./etnias/kayapo/kayapo.component').then(m => m.KayapoComponent),
                        title: 'Tribu Kayapó'
                    },
                    {
                        path: 'mehinaku',
                        data: { description: 'La cultura y vida de la tribu Mehinaku en la cuenca del Xingu.' },
                        loadComponent: () => import('./etnias/mehinaku/mehinaku.component').then(m => m.MehinakuComponent),
                        title: 'Tribu Mehinaku'
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

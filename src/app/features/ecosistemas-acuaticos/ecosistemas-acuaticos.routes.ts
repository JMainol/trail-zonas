
import { Routes } from '@angular/router';
import { EcosistemasAcuaticosComponent } from './ecosistemas-acuaticos.component';

export const ECOSISTEMAS_ACUATICOS_ROUTES: Routes = [
    {
        path: '',
        component: EcosistemasAcuaticosComponent,
        children: [
            {
                path: 'varzea-igapo',
                loadComponent: () => import('./varzea-igapo/varzea-igapo.component').then(m => m.VarzeaIgapoComponent),
                title: 'Várzea e Igapó'
            },
            {
                path: 'lagos-cochas',
                loadComponent: () => import('./lagos-cochas/lagos-cochas.component').then(m => m.LagosCochasComponent),
                title: 'Lagos y Cochas'
            },
            {
                path: '',
                redirectTo: 'varzea-igapo',
                pathMatch: 'full'
            }
        ]
    }
];

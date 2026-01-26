
import { Routes } from '@angular/router';
import { ConservacionComponent } from './conservacion.component';

export const CONSERVACION_ROUTES: Routes = [
    {
        path: '',
        component: ConservacionComponent,
        children: [
            {
                path: 'deforestacion-mineria',
                loadComponent: () => import('./deforestacion-mineria/deforestacion-mineria.component').then(m => m.DeforestacionMineriaComponent),
                title: 'Deforestación y Minería'
            },
            {
                path: 'cambio-climatico',
                loadComponent: () => import('./cambio-climatico/cambio-climatico.component').then(m => m.CambioClimaticoComponent),
                title: 'Cambio Climático Local'
            },
            {
                path: 'proyectos-soluciones',
                loadComponent: () => import('./proyectos-soluciones/proyectos-soluciones.component').then(m => m.ProyectosSolucionesComponent),
                title: 'Proyectos y Soluciones'
            },
            {
                path: '',
                redirectTo: 'deforestacion-mineria',
                pathMatch: 'full'
            }
        ]
    }
];

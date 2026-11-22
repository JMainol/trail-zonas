
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
                title: 'Deforestación y minería en la Amazonía',
                data: { description: 'Una década decisiva (2016-2026): incendios, ganadería, soja, minería de oro y carreteras frente a iniciativas como ARPA, JungleKeepers o el Fundo Amazônia.', schemaType: 'Article' }
            },
            {
                path: 'cambio-climatico',
                data: { noindex: true },
                loadComponent: () => import('./cambio-climatico/cambio-climatico.component').then(m => m.CambioClimaticoComponent),
                title: 'Cambio Climático Local'
            },
            {
                path: 'proyectos-soluciones',
                data: { noindex: true },
                loadComponent: () => import('./proyectos-soluciones/proyectos-soluciones.component').then(m => m.ProyectosSolucionesComponent),
                title: 'Proyectos y Soluciones'
            },
            {
                path: 'selva-vacia',
                loadComponent: () => import('./selva-vacia/selva-vacia.component').then(m => m.SelvaVaciaComponent),
                title: 'El síndrome de la selva vacía',
                data: { description: 'Bosques en pie pero sin fauna: el síndrome de la selva vacía según el ornitólogo José Álvarez Alonso, sus causas históricas y las vías para recuperar la vida silvestre.', schemaType: 'Article' }
            },
            {
                path: '',
                redirectTo: 'deforestacion-mineria',
                pathMatch: 'full'
            }
        ]
    }
];

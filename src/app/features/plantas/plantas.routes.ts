
import { Routes } from '@angular/router';
import { PlantasComponent } from './plantas.component';

export const PLANTAS_ROUTES: Routes = [
    {
        path: '',
        component: PlantasComponent,
        children: [
            {
                path: 'bosque-vertical',
                loadComponent: () => import('./bosque-vertical/bosque-vertical.component').then(m => m.BosqueVerticalComponent),
                title: 'El Bosque Vertical'
            },
            {
                path: 'tipos-flora',
                loadComponent: () => import('./tipos-flora/tipos-flora.component').then(m => m.TiposFloraComponent),
                title: 'Tipos de Flora'
            },
            {
                path: 'etnobotanica-usos',
                loadComponent: () => import('./etnobotanica-usos/etnobotanica-usos.component').then(m => m.EtnobotanicaUsosComponent),
                title: 'Etnobotánica y Usos'
            },
            {
                path: 'medicinales',
                loadComponent: () => import('./medicinales/medicinales.component').then(m => m.MedicinalesComponent),
                title: 'Plantas Medicinales'
            },
            {
                path: '',
                redirectTo: 'bosque-vertical',
                pathMatch: 'full'
            }
        ]
    }
];

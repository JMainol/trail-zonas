
import { Routes } from '@angular/router';
import { InsectosComponent } from './insectos.component';

export const INSECTOS_ROUTES: Routes = [
    {
        path: '',
        component: InsectosComponent,
        children: [
            {
                path: 'biologia-social',
                loadComponent: () => import('./biologia-social/biologia-social.component').then(m => m.BiologiaSocialComponent),
                title: 'Biología Social'
            },
            {
                path: 'mariposas-polillas',
                loadComponent: () => import('./mariposas-polillas/mariposas-polillas.component').then(m => m.MariposasPolillasComponent),
                title: 'Mariposas y Polillas'
            },
            {
                path: 'aranas-invertebrados',
                loadComponent: () => import('./aranas-invertebrados/aranas-invertebrados.component').then(m => m.AranasInvertebradosComponent),
                title: 'Arañas y Otros Invertebrados'
            },
            {
                path: 'cadena-trofica',
                loadComponent: () => import('./cadena-trofica/cadena-trofica.component').then(m => m.CadenaTroficaComponent),
                title: 'La Cadena Trófica'
            },
            {
                path: '',
                redirectTo: 'biologia-social',
                pathMatch: 'full'
            }
        ]
    }
];


import { Routes } from '@angular/router';
import { AnimalesComponent } from './animales.component';

export const ANIMALES_ROUTES: Routes = [
    {
        path: '',
        component: AnimalesComponent,
        children: [
            {
                path: 'mamiferos-terrestres',
                title: 'Mamíferos Terrestres',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./mamiferos-terrestres/mamiferos-terrestres.component').then(m => m.MamiferosTerrestresComponent),
                    },
                    { path: 'jaguar', loadComponent: () => import('./mamiferos-terrestres/jaguar/jaguar.component').then(m => m.JaguarComponent), title: 'Jaguar' },
                    { path: 'tapir', loadComponent: () => import('./mamiferos-terrestres/tapir/tapir.component').then(m => m.TapirComponent), title: 'Tapir Brasileño' },
                    { path: 'pecari', loadComponent: () => import('./mamiferos-terrestres/pecari/pecari.component').then(m => m.PecariComponent), title: 'Pecarí Labiado' }
                ]
            },
            {
                path: 'aves',
                title: 'Aves',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./aves/aves.component').then(m => m.AvesComponent),
                    },
                    { path: 'tucan', loadComponent: () => import('./aves/tucan/tucan.component').then(m => m.TucanComponent), title: 'Tucán' },
                    { path: 'cotinga', loadComponent: () => import('./aves/cotinga/cotinga.component').then(m => m.CotingaComponent), title: 'Cotinga' }
                ]
            },
            {
                path: 'reptiles-anfibios',
                loadComponent: () => import('./reptiles-anfibios/reptiles-anfibios.component').then(m => m.ReptilesAnfibiosComponent),
                title: 'Reptiles y Anfibios'
            },
            {
                path: 'fauna-acuatica',
                loadComponent: () => import('./fauna-acuatica/fauna-acuatica.component').then(m => m.FaunaAcuaticaComponent),
                title: 'Fauna Acuática'
            },
            {
                path: '',
                redirectTo: 'mamiferos-terrestres',
                pathMatch: 'full'
            }
        ]
    }
];

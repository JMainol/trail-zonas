
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
                        data: { description: 'Lista completa de los mamíferos terrestres más representativos de la selva amazónica.' },
                        loadComponent: () => import('./mamiferos-terrestres/mamiferos-terrestres.component').then(m => m.MamiferosTerrestresComponent),
                    },
                    { path: 'jaguar', data: { description: 'Conoce al jaguar, el mayor depredador de la Amazonía.' }, loadComponent: () => import('./mamiferos-terrestres/jaguar/jaguar.component').then(m => m.JaguarComponent), title: 'Jaguar' },
                    { path: 'tapir', data: { description: 'Descubre al tapir brasileño, el jardinero de la selva.' }, loadComponent: () => import('./mamiferos-terrestres/tapir/tapir.component').then(m => m.TapirComponent), title: 'Tapir Brasileño' },
                    { path: 'pecari', data: { description: 'Información sobre el pecarí labiado en la selva amazónica.' }, loadComponent: () => import('./mamiferos-terrestres/pecari/pecari.component').then(m => m.PecariComponent), title: 'Pecarí Labiado' }
                ]
            },
            {
                path: 'aves',
                title: 'Aves',
                children: [
                    {
                        path: '',
                        data: { description: 'Descubre la increíble variedad de aves exóticas que habitan en la Amazonía.' },
                        loadComponent: () => import('./aves/aves.component').then(m => m.AvesComponent),
                    },
                    { path: 'tucan', data: { description: 'Todo sobre el tucán vitelado y sus características únicas.' }, loadComponent: () => import('./aves/tucan/tucan.component').then(m => m.TucanComponent), title: 'Tucán' },
                    { path: 'cotinga', data: { description: 'Descubre a la hermosa cotinga de lentejuelas del Amazonas.' }, loadComponent: () => import('./aves/cotinga/cotinga.component').then(m => m.CotingaComponent), title: 'Cotinga' },
                    { path: 'tangara-paraiso', data: { description: 'Conoce a la colorida tangara paraíso, un ave única de la selva.' }, loadComponent: () => import('./aves/tangara-paraiso/tangara-paraiso.component').then(m => m.TangaraParaisoComponent), title: 'Tangara Paraíso' }
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

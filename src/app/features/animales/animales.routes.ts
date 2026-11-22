
import { Routes } from '@angular/router';
import { AnimalesComponent } from './animales.component';

export const ANIMALES_ROUTES: Routes = [
    {
        path: '',
        component: AnimalesComponent,
        children: [
            {
                path: 'mamiferos-terrestres',
                title: 'Mamíferos terrestres de la Amazonía',
                children: [
                    {
                        path: '',
                        data: { description: 'Jaguar, tapir y pecarí: fichas ilustradas de los mamíferos terrestres más representativos de la Amazonía, con vídeo, sonido y mapas de distribución.' },
                        loadComponent: () => import('./mamiferos-terrestres/mamiferos-terrestres.component').then(m => m.MamiferosTerrestresComponent),
                    },
                    { path: 'jaguar', data: { description: 'Jaguar (Panthera onca): el mayor felino de América y superdepredador de la Amazonía. Biología, comportamiento, rugido, vídeo y mapa de distribución.' }, loadComponent: () => import('./mamiferos-terrestres/jaguar/jaguar.component').then(m => m.JaguarComponent), title: 'Jaguar' },
                    { path: 'tapir', data: { description: 'Tapir amazónico (Tapirus terrestris), el «jardinero de la selva»: el mayor mamífero terrestre de Sudamérica y clave en la dispersión de semillas.' }, loadComponent: () => import('./mamiferos-terrestres/tapir/tapir.component').then(m => m.TapirComponent), title: 'Tapir amazónico' },
                    { path: 'pecari', data: { description: 'Pecarí labiado (Tayassu pecari): manadas de cientos de individuos que modelan el bosque amazónico. Ecología, comportamiento y amenazas.' }, loadComponent: () => import('./mamiferos-terrestres/pecari/pecari.component').then(m => m.PecariComponent), title: 'Pecarí labiado' }
                ]
            },
            {
                path: 'aves',
                title: 'Aves de la Amazonía',
                children: [
                    {
                        path: '',
                        data: { description: 'Tucán, cotinga y tangara paraíso: fichas ilustradas de algunas de las aves más espectaculares de la Amazonía, con cantos, vídeos y mapas.' },
                        loadComponent: () => import('./aves/aves.component').then(m => m.AvesComponent),
                    },
                    { path: 'tucan', data: { description: 'Tucán vitelado (Ramphastos vitellinus): emblema del dosel amazónico y gran dispersor de semillas. Características, canto, vídeo y distribución.' }, loadComponent: () => import('./aves/tucan/tucan.component').then(m => m.TucanComponent), title: 'Tucán vitelado' },
                    { path: 'cotinga', data: { description: 'Cotinga de lentejuelas (Cotinga cayana): el azul estructural de una de las aves más bellas de la Amazonía. Biología, comportamiento y conservación.' }, loadComponent: () => import('./aves/cotinga/cotinga.component').then(m => m.CotingaComponent), title: 'Cotinga de lentejuelas' },
                    { path: 'tangara-paraiso', data: { description: 'Tangara paraíso (Tangara chilensis): una de las aves más coloridas de la Amazonía. Plumaje, alimentación, vida social y canto.' }, loadComponent: () => import('./aves/tangara-paraiso/tangara-paraiso.component').then(m => m.TangaraParaisoComponent), title: 'Tangara paraíso' }
                ]
            },
            {
                path: 'reptiles-anfibios',
                data: { noindex: true },
                loadComponent: () => import('./reptiles-anfibios/reptiles-anfibios.component').then(m => m.ReptilesAnfibiosComponent),
                title: 'Reptiles y Anfibios'
            },
            {
                path: 'fauna-acuatica',
                data: { noindex: true },
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

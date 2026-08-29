import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        title: 'Amazonas Jungle - Inicio',
        data: { description: 'Descubre la Amazonía: su fauna increíble, plantas medicinales ancestrales y comunidades originarias.' },
        loadComponent: () => import('./home/home').then(m => m.HomeComponent)
    },
    {
        path: 'amazonia',
        loadChildren: () => import('./features/amazonia.routes').then(m => m.AMAZONIA_ROUTES)
    },
    {
        path: 'mision',
        title: 'Misión - Amazonas Jungle',
        data: { description: 'Conoce la misión del proyecto: una Wikipedia 2.0 colaborativa, open source y sin ánimo de lucro sobre la selva amazónica.' },
        loadComponent: () => import('./features/mision/mision.component').then(m => m.MisionComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];

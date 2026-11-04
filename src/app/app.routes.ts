import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        data: { description: 'Enciclopedia visual, abierta y colaborativa sobre la Amazonía: fauna, flora medicinal, pueblos indígenas, reservas naturales, conservación y recursos audiovisuales.' },
        loadComponent: () => import('./home/home').then(m => m.HomeComponent)
    },
    {
        path: 'amazonia',
        loadChildren: () => import('./features/amazonia.routes').then(m => m.AMAZONIA_ROUTES)
    },
    {
        path: 'mision',
        title: 'Nuestra misión',
        data: { description: 'Conoce la misión del proyecto: una Wikipedia 2.0 colaborativa, open source y sin ánimo de lucro sobre la selva amazónica.' },
        loadComponent: () => import('./features/mision/mision.component').then(m => m.MisionComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];

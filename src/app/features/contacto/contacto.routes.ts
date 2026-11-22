import { Routes } from '@angular/router';

export const CONTACTO_ROUTES: Routes = [
    {
        path: '',
        title: 'Contacto y colaboración',
        data: { description: 'Colabora con Selva Amazonas 2.0, la enciclopedia abierta de la Amazonía: biólogos, desarrolladores, diseñadores, fotógrafos e investigadores.' },
        loadComponent: () => import('./contacto').then(m => m.ContactoComponent)
    }
];

import { Routes } from '@angular/router';

export const CONTACTO_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./contacto').then(m => m.ContactoComponent)
    }
];


import { Routes } from '@angular/router';

export const AMAZONIA_ROUTES: Routes = [
    {
        path: 'animales',
        loadChildren: () => import('./animales/animales.routes').then(m => m.ANIMALES_ROUTES)
    },
    {
        path: 'plantas',
        loadChildren: () => import('./plantas/plantas.routes').then(m => m.PLANTAS_ROUTES)
    },
    {
        path: 'insectos',
        loadChildren: () => import('./insectos/insectos.routes').then(m => m.INSECTOS_ROUTES)
    },
    {
        path: 'tribus',
        loadChildren: () => import('./tribus/tribus.routes').then(m => m.TRIBUS_ROUTES)
    },
    {
        path: 'geografia',
        loadChildren: () => import('./geografia/geografia.routes').then(m => m.GEOGRAFIA_ROUTES)
    },
    {
        path: 'ecosistemas-acuaticos',
        loadChildren: () => import('./ecosistemas-acuaticos/ecosistemas-acuaticos.routes').then(m => m.ECOSISTEMAS_ACUATICOS_ROUTES)
    },
    {
        path: 'conservacion',
        loadChildren: () => import('./conservacion/conservacion.routes').then(m => m.CONSERVACION_ROUTES)
    },
    {
        path: 'reservas',
        loadChildren: () => import('./reservas/reservas.routes').then(m => m.RESERVAS_ROUTES)
    },
    {
        path: 'exploracion',
        loadChildren: () => import('./exploracion/exploracion.routes').then(m => m.EXPLORACION_ROUTES)
    },
    {
        path: 'contacto',
        loadChildren: () => import('./contacto/contacto.routes').then(m => m.CONTACTO_ROUTES)
    },
    {
        path: '',
        redirectTo: 'animales',
        pathMatch: 'full'
    }
];

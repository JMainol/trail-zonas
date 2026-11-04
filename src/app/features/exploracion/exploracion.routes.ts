import { Routes } from '@angular/router';

export const EXPLORACION_ROUTES: Routes = [
    {
        path: 'historia',
        title: 'Francisco de Orellana y el descubrimiento del Amazonas',
        data: { description: 'La expedición de Francisco de Orellana (1541-1542): la primera navegación del Amazonas, la crónica de fray Gaspar de Carvajal y el origen del nombre del río.', schemaType: 'Article' },
        loadComponent: () => import('./historia/historia.component').then(m => m.HistoriaComponent)
    },
    {
        path: '',
        redirectTo: 'historia',
        pathMatch: 'full'
    }
];

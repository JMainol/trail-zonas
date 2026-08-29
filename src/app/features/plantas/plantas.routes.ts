
import { Routes } from '@angular/router';
import { PlantasComponent } from './plantas.component';

export const PLANTAS_ROUTES: Routes = [
    {
        path: '',
        component: PlantasComponent,
        children: [
            {
                path: 'bosque-vertical',
                loadComponent: () => import('./bosque-vertical/bosque-vertical.component').then(m => m.BosqueVerticalComponent),
                title: 'El Bosque Vertical'
            },
            {
                path: 'tipos-flora',
                loadComponent: () => import('./tipos-flora/tipos-flora.component').then(m => m.TiposFloraComponent),
                title: 'Tipos de Flora'
            },
            {
                path: 'etnobotanica-usos',
                loadComponent: () => import('./etnobotanica-usos/etnobotanica-usos.component').then(m => m.EtnobotanicaUsosComponent),
                title: 'Etnobotánica y Usos'
            },
            {
                path: 'medicinales',
                title: 'Plantas Medicinales',
                children: [
                    {
                        path: '',
                        data: { description: 'Conoce las plantas medicinales de la Amazonía y sus usos tradicionales.' },
                        loadComponent: () => import('./medicinales/medicinales.component').then(m => m.MedicinalesComponent),
                    },
                    {
                        path: 'una-de-gato',
                        data: { description: 'Descubre los beneficios curativos de la Uña de Gato.' },
                        loadComponent: () => import('./medicinales/una-de-gato/una-de-gato.component').then(m => m.UnaDeGatoComponent),
                        title: 'Uña de Gato'
                    },
                    {
                        path: 'sangre-de-grado',
                        data: { description: 'Información sobre la Sangre de Grado, cicatrizante natural de la selva.' },
                        loadComponent: () => import('./medicinales/sangre-de-grado/sangre-de-grado.component').then(m => m.SangreDeGradoComponent),
                        title: 'Sangre de Grado'
                    },
                    {
                        path: 'ayahuasca',
                        data: { description: 'El misterio y la botánica detrás de la liana Ayahuasca.' },
                        loadComponent: () => import('./medicinales/ayahuasca/ayahuasca.component').then(m => m.AyahuascaComponent),
                        title: 'Ayahuasca'
                    }
                ]
            },
            {
                path: '',
                redirectTo: 'bosque-vertical',
                pathMatch: 'full'
            }
        ]
    }
];

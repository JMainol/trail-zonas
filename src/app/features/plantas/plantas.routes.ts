
import { Routes } from '@angular/router';
import { PlantasComponent } from './plantas.component';

export const PLANTAS_ROUTES: Routes = [
    {
        path: '',
        component: PlantasComponent,
        children: [
            {
                path: 'bosque-vertical',
                data: { noindex: true },
                loadComponent: () => import('./bosque-vertical/bosque-vertical.component').then(m => m.BosqueVerticalComponent),
                title: 'El Bosque Vertical'
            },
            {
                path: 'tipos-flora',
                data: { noindex: true },
                loadComponent: () => import('./tipos-flora/tipos-flora.component').then(m => m.TiposFloraComponent),
                title: 'Tipos de Flora'
            },
            {
                path: 'etnobotanica-usos',
                data: { noindex: true },
                loadComponent: () => import('./etnobotanica-usos/etnobotanica-usos.component').then(m => m.EtnobotanicaUsosComponent),
                title: 'Etnobotánica y Usos'
            },
            {
                path: 'medicinales',
                title: 'Plantas medicinales de la Amazonía',
                children: [
                    {
                        path: '',
                        data: { description: 'Uña de gato, sangre de grado y ayahuasca: plantas medicinales de la Amazonía, sus usos tradicionales y lo que dice la evidencia científica.' },
                        loadComponent: () => import('./medicinales/medicinales.component').then(m => m.MedicinalesComponent),
                    },
                    {
                        path: 'una-de-gato',
                        data: { description: 'Uña de gato (Uncaria tomentosa): liana amazónica con propiedades inmunomoduladoras y antiinflamatorias. Usos tradicionales y evidencia científica.' },
                        loadComponent: () => import('./medicinales/una-de-gato/una-de-gato.component').then(m => m.UnaDeGatoComponent),
                        title: 'Uña de gato'
                    },
                    {
                        path: 'sangre-de-grado',
                        data: { description: 'Sangre de grado (Croton lechleri): el látex cicatrizante de la Amazonía y origen del fármaco crofelemer. Propiedades, usos y evidencia.' },
                        loadComponent: () => import('./medicinales/sangre-de-grado/sangre-de-grado.component').then(m => m.SangreDeGradoComponent),
                        title: 'Sangre de grado'
                    },
                    {
                        path: 'ayahuasca',
                        data: { description: 'Ayahuasca (Banisteriopsis caapi): botánica, farmacología, uso ritual amazónico e investigación psiquiátrica actual sobre la «liana del alma».' },
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

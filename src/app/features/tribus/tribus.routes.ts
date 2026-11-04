
import { Routes } from '@angular/router';
import { TribusComponent } from './tribus.component';

export const TRIBUS_ROUTES: Routes = [
    {
        path: '',
        component: TribusComponent,
        children: [
            {
                path: 'etnias',
                title: 'Pueblos indígenas de la Amazonía',
                children: [
                    {
                        path: '',
                        data: { description: 'Waorani, kayapó, mehinaku y otros pueblos indígenas que habitan y protegen la Amazonía: cultura, lengua, territorio y desafíos actuales.' },
                        loadComponent: () => import('./etnias/etnias.component').then(m => m.EtniasComponent),
                    },
                    {
                        path: 'waorani',
                        data: { description: 'Pueblo waorani del Yasuní (Ecuador): cazadores con cerbatana, la lengua aislada wao terero y su defensa del territorio frente al petróleo.' },
                        loadComponent: () => import('./etnias/waorani/waorani.component').then(m => m.WaoraniComponent),
                        title: 'Pueblo waorani'
                    },
                    {
                        path: 'kayapo',
                        data: { description: 'Pueblo kayapó (mebêngôkre) del Xingu, Brasil: aldeas circulares, pintura corporal, ritos de paso y liderazgo en la defensa de la Amazonía.' },
                        loadComponent: () => import('./etnias/kayapo/kayapo.component').then(m => m.KayapoComponent),
                        title: 'Pueblo kayapó'
                    },
                    {
                        path: 'mehinaku',
                        data: { description: 'Pueblo mehinaku del Alto Xingu: aldeas circulares, el ritual del kwarup, las flautas sagradas y una vida social de transparencia radical.' },
                        loadComponent: () => import('./etnias/mehinaku/mehinaku.component').then(m => m.MehinakuComponent),
                        title: 'Pueblo mehinaku'
                    }
                ]
            },
            {
                path: 'etnias-regiones',
                data: { noindex: true },
                loadComponent: () => import('./etnias-regiones/etnias-regiones.component').then(m => m.EtniasRegionesComponent),
                title: 'Etnias Principales y Regiones'
            },
            {
                path: 'cultura-sociedad',
                data: { noindex: true },
                loadComponent: () => import('./cultura-sociedad/cultura-sociedad.component').then(m => m.CulturaSociedadComponent),
                title: 'Cultura y Sociedad'
            },
            {
                path: 'conocimiento-ancestral',
                data: { noindex: true },
                loadComponent: () => import('./conocimiento-ancestral/conocimiento-ancestral.component').then(m => m.ConocimientoAncestralComponent),
                title: 'Conocimiento Ancestral'
            },
            {
                path: 'desafios-supervivencia',
                data: { noindex: true },
                loadComponent: () => import('./desafios-supervivencia/desafios-supervivencia.component').then(m => m.DesafiosSupervivenciaComponent),
                title: 'Desafíos y Supervivencia'
            },
            {
                path: '',
                redirectTo: 'etnias-regiones',
                pathMatch: 'full'
            }
        ]
    }
];

import { Routes } from '@angular/router';

export const RECURSOS_ROUTES: Routes = [
    {
        path: '',
        title: 'Recursos sobre la Amazonía: documentales e investigación',
        data: { description: 'Documentales, proyectos de investigación y recursos recomendados para conocer, comprender y defender la Amazonía.', schemaType: 'CollectionPage' },
        loadComponent: () => import('./recursos-hub/recursos-hub.component').then(m => m.RecursosHubComponent)
    },
    {
        path: 'documentales',
        children: [
            {
                path: 'yanuni',
                title: 'Yanuni: el documental de Juma Xipaia producido por Leonardo DiCaprio',
                data: {
                    description: 'Yanuni (2025), de Richard Ladkani y producido por Leonardo DiCaprio: la lucha de la cacica Juma Xipaia por la Amazonía. Tráiler, ficha técnica y contexto.',
                    ogImage: 'https://i.ytimg.com/vi/LRMXjbDMeWY/maxresdefault.jpg',
                    schemaType: 'Article',
                    jsonLd: {
                        about: {
                            '@type': 'Movie',
                            name: 'Yanuni',
                            director: { '@type': 'Person', name: 'Richard Ladkani' },
                            producer: [{ '@type': 'Person', name: 'Leonardo DiCaprio' }, { '@type': 'Person', name: 'Juma Xipaia' }],
                            dateCreated: '2025',
                            duration: 'PT112M',
                            trailer: {
                                '@type': 'VideoObject',
                                name: 'Yanuni — Official Trailer',
                                embedUrl: 'https://www.youtube.com/embed/LRMXjbDMeWY',
                                thumbnailUrl: 'https://i.ytimg.com/vi/LRMXjbDMeWY/maxresdefault.jpg'
                            }
                        }
                    }
                },
                loadComponent: () => import('./yanuni/yanuni.component').then(m => m.YanuniComponent)
            },
            {
                path: 'ash-dykes',
                title: 'Ash Dykes y Uncharted Amazon: del nacimiento al mar del río Coppename',
                data: {
                    description: 'El explorador galés Ash Dykes recorrió el río Coppename, en la Amazonía de Surinam, desde su nacimiento hasta el Atlántico. Expedición, récords y documental.',
                    schemaType: 'Article',
                    jsonLd: { about: { '@type': 'Person', name: 'Ash Dykes', jobTitle: 'Explorer', url: 'https://ashdykes.com/' } }
                },
                loadComponent: () => import('./ash-dykes/ash-dykes.component').then(m => m.AshDykesComponent)
            },
            { path: '', redirectTo: '/amazonia/recursos', pathMatch: 'full' }
        ]
    },
    {
        path: 'investigacion',
        children: [
            {
                path: 'vozterra',
                title: 'VozTerra: paisajes sonoros para escuchar la naturaleza',
                data: {
                    description: 'VozTerra es un colectivo colombiano que graba paisajes sonoros, como los del piedemonte amazónico del Caquetá, para concienciar sobre la crisis climática y la biodiversidad.',
                    schemaType: 'Article',
                    jsonLd: { about: { '@type': 'Organization', name: 'VozTerra', url: 'https://www.vozterra.com/', foundingDate: '2019-08' } }
                },
                loadComponent: () => import('./vozterra/vozterra.component').then(m => m.VozterraComponent)
            },
            { path: '', redirectTo: '/amazonia/recursos', pathMatch: 'full' }
        ]
    }
];

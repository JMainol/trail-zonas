/** Catálogo de recursos publicados; alimenta la portada de Recursos y los enlaces relacionados. */
export interface ResourceEntry {
  slug: string;
  link: string;
  /** Clave i18n de la categoría (COMMON.*). */
  categoryKey: string;
  titleKey: string;
  summaryKey: string;
  icon: string;
  accent: string;
}

export const RESOURCES_CATALOG: ResourceEntry[] = [
  {
    slug: 'yanuni',
    link: '/amazonia/recursos/documentales/yanuni',
    categoryKey: 'COMMON.DOCUMENTARIES',
    titleKey: 'RESOURCES.YANUNI.TITLE',
    summaryKey: 'RESOURCES.YANUNI.CARD',
    icon: 'movie',
    accent: '#f59e0b',
  },
  {
    slug: 'ash-dykes',
    link: '/amazonia/recursos/documentales/ash-dykes',
    categoryKey: 'COMMON.DOCUMENTARIES',
    titleKey: 'RESOURCES.ASH_DYKES.TITLE',
    summaryKey: 'RESOURCES.ASH_DYKES.CARD',
    icon: 'explore',
    accent: '#38bdf8',
  },
  {
    slug: 'vozterra',
    link: '/amazonia/recursos/investigacion/vozterra',
    categoryKey: 'COMMON.RESEARCH',
    titleKey: 'RESOURCES.VOZTERRA.TITLE',
    summaryKey: 'RESOURCES.VOZTERRA.CARD',
    icon: 'graphic_eq',
    accent: '#a78bfa',
  },
];

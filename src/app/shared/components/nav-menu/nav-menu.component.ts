
import { Component, signal, computed, ElementRef, ViewChild, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface SearchResult {
   title: string;
   enTitle?: string;
   scientificName?: string;
   link: string;
}

@Component({
   selector: 'app-nav-menu',
   standalone: true,
   imports: [RouterLink, RouterLinkActive, CommonModule, MatIconModule, TranslateModule, FormsModule],
   template: `
    <nav class="sticky top-0 z-[1000] w-full bg-[#020617]/80 backdrop-blur-xl border-b border-[#1e293b] shadow-[0_4px_30px_rgba(0,0,0,0.5)]" aria-label="MenÃº Principal">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo / Home Link -->
          <div class="flex-shrink-0 flex items-center">
            <a routerLink="/" class="text-[1.2rem] font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:scale-105 transition-all cursor-pointer tracking-tighter filter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              {{ 'BRAND.NAME' | translate }}
            </a>
          </div>
          
          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center justify-between flex-grow ml-10">
            <ul class="flex items-center justify-center space-x-2">
              
              <!-- Generador de Secciones -->
              <ng-container *ngFor="let section of menuItems">
                <li class="relative group" (mouseenter)="section.items ? onMouseEnter(section.id) : null" (mouseleave)="onMouseLeave()">
                    
                    <!-- Si tiene Ã­tems (Dropdown) -->
                    <button *ngIf="section.items" class="nav-item group-hover:glow-cyan focus:outline-none"
                            [attr.aria-expanded]="activeDropdown === section.id"
                            [class.nav-disabled]="section.disabled">
                        {{ section.label | translate }}
                        <mat-icon class="icon transition-transform duration-300 group-hover:rotate-180">expand_more</mat-icon>
                    </button>

                    <!-- Si es link directo -->
                    <a *ngIf="section.link" [routerLink]="section.disabled ? null : section.link" routerLinkActive="active-link" 
                       class="nav-item group-hover:glow-cyan"
                       [class.nav-disabled]="section.disabled">
                        {{ section.label | translate }}
                    </a>

                    <!-- Mega Menu / Dropdown -->
                    <div *ngIf="section.items && !section.disabled" class="dropdown-panel">
                        <div class="dropdown-content">
                            <div class="py-2">
                                <ng-container *ngFor="let item of section.items">
                                    <a *ngIf="!item.items" 
                                       [routerLink]="item.disabled ? null : item.link"
                                       routerLinkActive="dropdown-active"
                                       class="dropdown-item flex items-center justify-between gap-4 w-full"
                                       [class.nav-disabled]="item.disabled">
                                        <span>{{ item.label | translate }}</span>
                                        <mat-icon *ngIf="item.icon" class="text-[18px] !w-auto !h-auto opacity-70 translate-y-[1px]">{{ item.icon }}</mat-icon>
                                    </a>

                                    <!-- Nested Dropdown Item -->
                                    <div *ngIf="item.items" class="relative has-nested-dropdown" [class.nav-disabled]="item.disabled">
                                        <div class="dropdown-item flex items-center gap-[10px] cursor-pointer group/nested">
                                            <a *ngIf="item.link" [routerLink]="item.disabled ? null : item.link" routerLinkActive="dropdown-active" [routerLinkActiveOptions]="{exact: true}" class="hover:text-cyan-400 transition-colors">
                                                {{ item.label | translate }}
                                            </a>
                                            <span *ngIf="!item.link">{{ item.label | translate }}</span>
                                            <mat-icon class="text-xs opacity-50 transition-transform duration-300 group-hover/nested:translate-x-1 group-hover/nested:text-blue-400 !h-auto !w-auto translate-y-[1.5px]">chevron_right</mat-icon>
                                        </div>
                                        <div class="nested-dropdown">
                                            <div class="dropdown-content-premium py-2">
                                                <a *ngFor="let subItem of item.items" 
                                                   [routerLink]="subItem.disabled ? null : subItem.link"
                                                   routerLinkActive="dropdown-active"
                                                   class="dropdown-item-premium flex items-center justify-between gap-4 w-full"
                                                   [class.nav-disabled]="subItem.disabled">
                                                    <span>{{ subItem.label | translate }}</span>
                                                    <mat-icon *ngIf="subItem.icon" class="text-[18px] !w-auto !h-auto opacity-70 translate-y-[1px]">{{ subItem.icon }}</mat-icon>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </ng-container>
                            </div>
                        </div>
                    </div>
                </li>
              </ng-container>

            </ul>

            <!-- Right Controls: Search + Language Switcher -->
            <div class="flex items-center gap-3">
              <!-- Search Button -->
              <button
                class="search-icon-btn"
                (click)="toggleSearch()"
                [class.active]="isSearchOpen()"
                title="Buscar paginas"
                aria-label="Abrir buscador"
              >
                <mat-icon>search</mat-icon>
              </button>

              <!-- Language Switcher Desktop -->
              <div class="language-switcher">
                 <button (click)="switchLanguage('es')" [class.active]="currentLang === 'es'" class="lang-btn">ES</button>
                 <div class="divider"></div>
                 <button (click)="switchLanguage('en')" [class.active]="currentLang === 'en'" class="lang-btn">EN</button>
              </div>
            </div>
          </div>

          <!-- Mobile Controls (Language + Search + Hamburger) -->
          <div class="flex md:hidden items-center gap-1.5 sm:gap-2">
             <!-- Language Switcher Mobile -->
             <button (click)="toggleLanguage()" class="mobile-lang-btn">
                {{ currentLang | uppercase }}
             </button>

             <!-- Search Button Mobile -->
             <button
               class="search-icon-btn search-icon-btn--mobile"
               (click)="toggleSearch()"
               [class.active]="isSearchOpen()"
               title="Buscar paginas"
               aria-label="Abrir buscador"
             >
               <mat-icon>search</mat-icon>
             </button>

            <!-- Hamburger Button -->
            <button (click)="toggleMobileMenu()" type="button" class="mobile-menu-btn" aria-controls="mobile-menu" [attr.aria-expanded]="isMobileMenuOpen">
              <span class="sr-only">Abrir menú principal</span>
              <mat-icon>{{ isMobileMenuOpen ? 'close' : 'menu' }}</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Panel -->
      <div class="md:hidden transition-all duration-500 ease-in-out bg-[#020617] border-t border-[#1e293b]" [class.max-h-0]="!isMobileMenuOpen" [class.max-h-screen]="isMobileMenuOpen" [class.opacity-0]="!isMobileMenuOpen" [class.overflow-hidden]="!isMobileMenuOpen" id="mobile-menu">
        <div class="px-4 pt-4 pb-8 space-y-2">
            <div *ngFor="let section of menuItems" class="space-y-1">
                <!-- Si tiene Ã­tems (Mobile Dropdown) -->
                <ng-container *ngIf="section.items">
                    <button *ngIf="!section.disabled" (click)="toggleMobileSection(section.id)" 
                            class="w-full text-left flex justify-between nav-item-mobile">
                        {{ section.label | translate }}
                        <mat-icon>{{ activeMobileSection === section.id ? 'expand_less' : 'expand_more' }}</mat-icon>
                    </button>
                    <div *ngIf="section.disabled" class="w-full text-left flex justify-between nav-item-mobile nav-disabled">
                        {{ section.label | translate }}
                    </div>
                </ng-container>

                <!-- Si es link directo (Mobile) -->
                <ng-container *ngIf="section.link">
                    <a *ngIf="!section.disabled" [routerLink]="section.link" 
                       (click)="closeMobileMenu()" 
                       class="w-full text-left block nav-item-mobile">
                        {{ section.label | translate }}
                    </a>
                    <div *ngIf="section.disabled" class="w-full text-left block nav-item-mobile nav-disabled">
                        {{ section.label | translate }}
                    </div>
                </ng-container>
                
                <div *ngIf="section.items && activeMobileSection === section.id && !section.disabled" class="pl-4 space-y-1 mt-1 border-l-2 border-cyan-500/30">
                    <ng-container *ngFor="let item of section.items">
                        <!-- Regular Mobile Item -->
                        <ng-container *ngIf="!item.items">
                            <a *ngIf="!item.disabled"
                               [routerLink]="item.link" 
                               (click)="closeMobileMenu()"
                               class="flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium transition-all text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10">
                               <span>{{ item.label | translate }}</span>
                               <mat-icon *ngIf="item.icon" class="text-[18px] w-[18px] h-[18px] opacity-70">{{ item.icon }}</mat-icon>
                            </a>
                            <div *ngIf="item.disabled"
                                 class="block px-3 py-3 rounded-lg text-base font-medium nav-disabled">
                                 {{ item.label | translate }}
                            </div>
                        </ng-container>
                        
                        <!-- Nested Mobile Item -->
                        <div *ngIf="item.items" class="space-y-1">
                            <div class="flex items-center justify-between nav-item-mobile pr-2" [class.nav-disabled]="item.disabled">
                                <ng-container *ngIf="!item.disabled">
                                    <a *ngIf="item.link" [routerLink]="item.link" (click)="closeMobileMenu()" class="flex-grow">
                                        {{ item.label | translate }}
                                    </a>
                                    <span *ngIf="!item.link" class="flex-grow">
                                        {{ item.label | translate }}
                                    </span>
                                    <button (click)="toggleMobileSubSection(item.label)" class="p-2 hover:bg-cyan-500/10 rounded-lg transition-all">
                                        <mat-icon class="text-xl">{{ activeMobileSubSection === item.label ? 'expand_less' : 'expand_more' }}</mat-icon>
                                    </button>
                                </ng-container>
                                <ng-container *ngIf="item.disabled">
                                    <span class="flex-grow">
                                        {{ item.label | translate }}
                                    </span>
                                </ng-container>
                            </div>
                            
                            <div *ngIf="activeMobileSubSection === item.label && !item.disabled" 
                                 class="pl-4 border-l-2 border-cyan-800/30 space-y-1 mt-1">
                                <ng-container *ngFor="let subItem of item.items">
                                    <a *ngIf="!subItem.disabled"
                                       [routerLink]="subItem.link" 
                                       (click)="closeMobileMenu()"
                                       class="flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium transition-all text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10">
                                       <span>{{ subItem.label | translate }}</span>
                                       <mat-icon *ngIf="subItem.icon" class="text-[18px] w-[18px] h-[18px] opacity-70">{{ subItem.icon }}</mat-icon>
                                    </a>
                                    <div *ngIf="subItem.disabled"
                                         class="block px-3 py-3 rounded-lg text-base font-medium nav-disabled">
                                         {{ subItem.label | translate }}
                                    </div>
                                </ng-container>
                            </div>
                        </div>
                    </ng-container>
                </div>
            </div>
        </div>
      </div>

      <!-- Search Panel -->
      <div class="search-panel" [class.search-panel--open]="isSearchOpen()">
        <div class="search-panel__inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

          <!-- Input Row -->
          <div class="search-input-row">
            <div class="search-field-wrap">
              <mat-icon class="search-field-icon">search</mat-icon>
              <input
                #searchInput
                id="search-input"
                type="text"
                class="search-field"
                placeholder="Buscar paginas..."
                [value]="searchQuery()"
                (input)="onQueryChange($any($event.target).value)"
                (keydown)="onKeyDown($event)"
                autocomplete="off"
                aria-label="Campo de busqueda"
              />
              <button
                *ngIf="searchQuery()"
                class="search-clear-btn"
                (click)="clearSearch()"
                title="Limpiar busqueda"
              >
                <mat-icon>close</mat-icon>
              </button>
            </div>

            <!-- Navigate button -->
            <button
              class="search-go-btn"
              [disabled]="filteredResults().length === 0"
              (click)="navigateToSelected()"
              title="Ir a la pagina seleccionada"
            >
              <mat-icon>arrow_forward</mat-icon>
              <span>Ir</span>
            </button>

            <!-- Close button -->
            <button class="search-close-btn" (click)="closeSearch()" title="Cerrar buscador (Esc)">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <!-- Keyboard hint -->
          <p class="search-hint">
            <kbd>&uarr;&darr;</kbd> Navegar resultados &nbsp;&middot;&nbsp;
            <kbd>Enter</kbd> Ir a la pagina &nbsp;&middot;&nbsp;
            <kbd>Esc</kbd> Cerrar
          </p>

          <!-- Results -->
          <div class="search-results" *ngIf="searchQuery()">

            <!-- No results -->
            <div *ngIf="filteredResults().length === 0" class="search-no-results">
              <mat-icon>search_off</mat-icon>
              <span>No se encontraron resultados para <strong>"{{ searchQuery() }}"</strong></span>
            </div>

            <!-- Result list -->
            <ul *ngIf="filteredResults().length > 0" class="search-results-list" role="listbox">
              <li
                *ngFor="let result of filteredResults(); let i = index"
                class="search-result-item"
                [class.search-result-item--active]="selectedIndex() === i"
                (click)="navigateTo(result.link)"
                (mouseenter)="selectedIndex.set(i)"
                role="option"
                [attr.aria-selected]="selectedIndex() === i"
              >
                <mat-icon class="search-result-icon">chevron_right</mat-icon>
                <span [innerHTML]="highlight(result.displayTitle)"></span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </nav>
  `,
   styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent {
   isMobileMenuOpen = false;
   activeDropdown: string | null = null;
   activeMobileSection: string | null = null;
   activeMobileSubSection: string | null = null;

   // Search state
   isSearchOpen = signal(false);
   searchQuery = signal('');
   selectedIndex = signal(-1);

   private sanitizer = inject(DomSanitizer);

   @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

   private router = inject(Router);

   get currentLang() {
      return this.translate.currentLang || 'es';
   }

   // -------------------------------------------------------
   // Searchable pages catalog (Spanish titles + routes)
   // ------------------------------------------------
   private readonly searchablePages: SearchResult[] = [
      // Home
      { title: 'Inicio', enTitle: 'Home', link: '/' },

      // Animales - Mammals
      { title: 'Listado Mamiferos Terrestres', enTitle: 'Terrestrial Mammals List', link: '/amazonia/animales/mamiferos-terrestres' },
      { title: 'Jaguar', enTitle: 'Jaguar', link: '/amazonia/animales/mamiferos-terrestres/jaguar' },
      { title: 'Pecari', enTitle: 'Peccary', link: '/amazonia/animales/mamiferos-terrestres/pecari' },
      { title: 'Tapir', enTitle: 'Tapir', link: '/amazonia/animales/mamiferos-terrestres/tapir' },

      // Animales - Aves
      { title: 'Listado Aves', enTitle: 'Birds List', link: '/amazonia/animales/aves' },
      { title: 'Tucan Vitelado', enTitle: 'Channel-billed Toucan', scientificName: 'Ramphastos vitellinus', link: '/amazonia/animales/aves/tucan' },
      { title: 'Cotinga de Lentejuelas', enTitle: 'Spangled Cotinga', scientificName: 'Cotinga cayana', link: '/amazonia/animales/aves/cotinga' },
      { title: 'Tangara del Paraiso', enTitle: 'Paradise Tanager', scientificName: 'Tangara chilensis', link: '/amazonia/animales/aves/tangara-paraiso' },

      // Plantas - Medicinales
      { title: 'Listado Plantas Medicinales', enTitle: 'Medicinal Plants List', link: '/amazonia/plantas/medicinales' },
      { title: 'Ayahuasca', enTitle: 'Ayahuasca', link: '/amazonia/plantas/medicinales/ayahuasca' },
      { title: 'Sangre de Grado', enTitle: 'Dragons Blood', link: '/amazonia/plantas/medicinales/sangre-de-grado' },
      { title: 'Uña de Gato', enTitle: 'Cats Claw', link: '/amazonia/plantas/medicinales/una-de-gato' },

      // Geografia
      { title: 'Mapa Amazonico', enTitle: 'Amazon Map', link: '/amazonia/reservas/mapa' },

      // Tribus
      { title: 'Etnias de la Amazonia', enTitle: 'Amazon Ethnicities', link: '/amazonia/tribus/etnias' },
      { title: 'Pueblo Waorani', enTitle: 'Waorani People', link: '/amazonia/tribus/etnias/waorani' },

      // Exploracion
      { title: 'Francisco de Orellana,Historia de la Exploracion Amazonica', enTitle: 'Francisco de Orellana, History of Amazonian Exploration', link: '/amazonia/exploracion/historia' },

      // Contacto
      { title: 'Contacto', enTitle: 'Contact', link: '/amazonia/contacto' },
   ];

   filteredResults = computed(() => {
      const q = this.searchQuery().trim().toLowerCase();
      if (!q) return [];
      const currentLang = this.currentLang;
      
      return this.searchablePages
         .filter(p => 
            p.title.toLowerCase().includes(q) || 
            (p.enTitle && p.enTitle.toLowerCase().includes(q)) ||
            (p.scientificName && p.scientificName.toLowerCase().includes(q))
         )
         .map(p => ({
            ...p,
            displayTitle: currentLang === 'es' ? p.title : (p.enTitle || p.title)
         }));
   });

   menuItems: any[] = [
      {
         id: 'animales',
         label: 'COMMON.ANIMALS',
         items: [
            {
               label: 'COMMON.BIRDS',
               link: '/amazonia/animales/aves',
               items: [
                  { label: 'COMMON.BIRDS_LIST', link: '/amazonia/animales/aves', icon: 'format_list_bulleted' },
                   { label: 'BIRDS.TOUCAN', link: '/amazonia/animales/aves/tucan' },
                   { label: 'BIRDS.COTINGA', link: '/amazonia/animales/aves/cotinga' },
                   { label: 'BIRDS.TANGARA', link: '/amazonia/animales/aves/tangara-paraiso' }
               ]
            },
            {
               label: 'COMMON.MAMMALS',
               link: '/amazonia/animales/mamiferos-terrestres',
               items: [
                  { label: 'COMMON.MAMMALS_LIST', link: '/amazonia/animales/mamiferos-terrestres', icon: 'format_list_bulleted' },
                  { label: 'Jaguar', link: '/amazonia/animales/mamiferos-terrestres/jaguar' },
                  { label: 'Pecari', link: '/amazonia/animales/mamiferos-terrestres/pecari' },
                  { label: 'Tapir', link: '/amazonia/animales/mamiferos-terrestres/tapir' }
               ]
            },
            { label: 'COMMON.REPTILES', link: '/amazonia/animales/reptiles-anfibios', disabled: true },
            { label: 'COMMON.AQUATIC_FAUNA', link: '/amazonia/animales/fauna-acuatica', disabled: true }
         ]
      },
      {
         id: 'plantas',
         label: 'COMMON.PLANTS',
         items: [
            {
               label: 'COMMON.MEDICINAL',
               link: '/amazonia/plantas/medicinales',
               items: [
                  { label: 'COMMON.MEDICINAL_LIST', link: '/amazonia/plantas/medicinales', icon: 'format_list_bulleted' },
                  { label: 'Ayahuasca', link: '/amazonia/plantas/medicinales/ayahuasca' },
                  { label: 'Sangre de Grado', link: '/amazonia/plantas/medicinales/sangre-de-grado' },
                  { label: 'Uña de Gato', link: '/amazonia/plantas/medicinales/una-de-gato' }
               ]
            },
            { label: 'COMMON.VERTICAL_FOREST', link: '/amazonia/plantas/bosque-vertical', disabled: true },
            { label: 'COMMON.FLORA_TYPES', link: '/amazonia/plantas/tipos-flora', disabled: true },
            { label: 'COMMON.ETHNOBOTANY', link: '/amazonia/plantas/etnobotanica-usos', disabled: true }
         ]
      },
      {
         id: 'insectos',
         label: 'COMMON.INSECTS',
         items: [
            { label: 'COMMON.SOCIAL_BIOLOGY', link: '/amazonia/insectos/biologia-social', disabled: true },
            { label: 'COMMON.BUTTERFLIES', link: '/amazonia/insectos/mariposas-polillas', disabled: true },
            { label: 'COMMON.SPIDERS', link: '/amazonia/insectos/aranas-invertebrados', disabled: true },
            { label: 'COMMON.FOOD_CHAIN', link: '/amazonia/insectos/cadena-trofica', disabled: true }
         ]
      },
      {
         id: 'reservas',
         label: 'COMMON.GEOGRAPHY',
         items: [
            { label: 'COMMON.MAP', link: '/amazonia/reservas/mapa' },
            { label: 'COMMON.MANU', link: '/amazonia/geografia/manu', disabled: true },
            { label: 'COMMON.YASUNI', link: '/amazonia/geografia/yasuni', disabled: true },
            { label: 'COMMON.JAU', link: '/amazonia/geografia/jau', disabled: true },
            { label: 'COMMON.PACAYA', link: '/amazonia/geografia/pacaya', disabled: true },
            { label: 'COMMON.CHIRIBIQUETE', link: '/amazonia/geografia/chiribiquete', disabled: true }
         ]
      },
      {
         id: 'tribus',
         label: 'COMMON.TRIBES',
         items: [
            {
               label: 'COMMON.ETHNIC_REGIONS',
               link: '/amazonia/tribus/etnias',
               items: [
                  { label: 'COMMON.ETHNIC_LIST', link: '/amazonia/tribus/etnias', icon: 'format_list_bulleted' },
                  { label: 'COMMON.WAORANI', link: '/amazonia/tribus/etnias/waorani' },
                  { label: 'Cofán', link: '/amazonia/tribus/etnias/cofan', disabled: true },
                  { label: 'Shuar', link: '/amazonia/tribus/etnias/shuar', disabled: true }
               ]
            },
            { label: 'COMMON.CULTURE_SOCIETY', link: '/amazonia/tribus/cultura-sociedad', disabled: true },
            { label: 'COMMON.ANCESTRAL_KNOWLEDGE', link: '/amazonia/tribus/conocimiento-ancestral', disabled: true },
            { label: 'COMMON.CHALLENGES', link: '/amazonia/tribus/desafios-supervivencia', disabled: true }
         ]
      },
      {
         id: 'conservacion',
         label: 'COMMON.CONSERVATION',
         items: [
            { label: 'COMMON.DEFORESTATION', link: '/amazonia/conservacion/deforestacion-mineria' },
            { label: 'COMMON.CLIMATE_CHANGE', link: '/amazonia/conservacion/cambio-climatico', disabled: true },
            { label: 'COMMON.PROJECTS', link: '/amazonia/conservacion/proyectos-soluciones', disabled: true }
         ]
      },
      {
         id: 'recursos',
         label: 'COMMON.RESOURCES',
         items: [
            { label: 'COMMON.BOOKS', link: '/amazonia/recursos/libros', disabled: true },
            { label: 'COMMON.DOCUMENTARIES', link: '/amazonia/recursos/documentales', disabled: true },
            { label: 'COMMON.MOVIES', link: '/amazonia/recursos/peliculas', disabled: true },
            { label: 'COMMON.RESEARCH', link: '/amazonia/recursos/investigacion', disabled: true }
         ]
      },
      {
         id: 'exploracion',
         label: 'COMMON.EXPLORATION',
         items: [
            { label: 'COMMON.HISTORY', link: '/amazonia/exploracion/historia' },
            { label: 'COMMON.SURVIVAL', link: '/amazonia/exploracion/supervivencia', disabled: true }
         ]
      },
      {
         id: 'contacto',
         label: 'COMMON.CONTACT',
         link: '/amazonia/contacto'
      }
   ];

   constructor(private translate: TranslateService) { }

   // ===================== Search methods =====================

   toggleSearch() {
      if (this.isSearchOpen()) {
         this.closeSearch();
      } else {
         this.isMobileMenuOpen = false;
         this.isSearchOpen.set(true);
         // Focus input after animation frame
         setTimeout(() => {
            this.searchInputRef?.nativeElement?.focus();
         }, 50);
      }
   }

   closeSearch() {
      this.isSearchOpen.set(false);
      this.clearSearch();
   }

   clearSearch() {
      this.searchQuery.set('');
      this.selectedIndex.set(-1);
   }

   onQueryChange(value: string) {
      this.searchQuery.set(value);
      this.selectedIndex.set(-1);
   }

   onKeyDown(event: KeyboardEvent) {
      const results = this.filteredResults();
      const total = results.length;

      switch (event.key) {
         case 'Escape':
            this.closeSearch();
            break;

         case 'Enter':
            event.preventDefault();
            if (total > 0) {
               const idx = this.selectedIndex() >= 0 ? this.selectedIndex() : 0;
               this.navigateTo(results[idx].link);
            }
            break;

         case 'ArrowDown':
            event.preventDefault();
            if (total > 0) {
               const next = this.selectedIndex() + 1;
               this.selectedIndex.set(next >= total ? 0 : next);
               this.scrollActiveIntoView();
            }
            break;

         case 'ArrowUp':
            event.preventDefault();
            if (total > 0) {
               const prev = this.selectedIndex() - 1;
               this.selectedIndex.set(prev < 0 ? total - 1 : prev);
               this.scrollActiveIntoView();
            }
            break;
      }
   }

   navigateToSelected() {
      const results = this.filteredResults();
      if (results.length === 0) return;
      const idx = this.selectedIndex() >= 0 ? this.selectedIndex() : 0;
      this.navigateTo(results[idx].link);
   }

   navigateTo(link: string) {
      this.router.navigateByUrl(link);
      this.closeSearch();
   }

   highlight(title: string): SafeHtml {
      const q = this.searchQuery().trim();
      if (!q) return title;
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const highlighted = title.replace(
         new RegExp(`(${escaped})`, 'gi'),
         `<span class="search-highlight">$1</span>`
      );
      return this.sanitizer.bypassSecurityTrustHtml(highlighted);
   }

   private scrollActiveIntoView() {
      setTimeout(() => {
         const el = document.querySelector('.search-result-item--active');
         el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }, 0);
   }

   @HostListener('document:keydown.escape')
   onEscape() {
      if (this.isSearchOpen()) {
         this.closeSearch();
      }
   }

   // ===================== Nav methods =====================

   switchLanguage(lang: string) {
      this.translate.use(lang);
   }

   toggleLanguage() {
      const newLang = this.currentLang === 'es' ? 'en' : 'es';
      this.translate.use(newLang);
   }

   onMouseEnter(id: string) {
      this.activeDropdown = id;
   }

   onMouseLeave() {
      this.activeDropdown = null;
   }

   toggleMobileMenu() {
      if (!this.isMobileMenuOpen) {
         this.closeSearch();
      }
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
   }

   toggleMobileSection(id: string) {
      if (this.activeMobileSection === id) {
         this.activeMobileSection = null;
      } else {
         this.activeMobileSection = id;
         this.activeMobileSubSection = null;
      }
   }

   toggleMobileSubSection(label: string) {
      if (this.activeMobileSubSection === label) {
         this.activeMobileSubSection = null;
      } else {
         this.activeMobileSubSection = label;
      }
   }

   closeMobileMenu() {
      this.isMobileMenuOpen = false;
      this.activeMobileSection = null;
      this.activeMobileSubSection = null;
   }
}
// search-feature

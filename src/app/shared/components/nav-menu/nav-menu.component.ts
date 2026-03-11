
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
   selector: 'app-nav-menu',
   standalone: true,
   imports: [RouterLink, RouterLinkActive, CommonModule, MatIconModule, TranslateModule],
   template: `
    <nav class="sticky top-0 z-[1000] w-full bg-[#020617]/80 backdrop-blur-xl border-b border-[#1e293b] shadow-[0_4px_30px_rgba(0,0,0,0.5)]" aria-label="Menú Principal">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo / Home Link -->
          <div class="flex-shrink-0 flex items-center">
            <a routerLink="/" class="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:scale-105 transition-all cursor-pointer tracking-tighter filter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              SELVA AMAZONAS
            </a>
          </div>
          
          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center justify-between flex-grow ml-10">
            <ul class="flex items-center justify-center space-x-2">
              
              <!-- Generador de Secciones -->
              <ng-container *ngFor="let section of menuItems">
                <li class="relative group" (mouseenter)="section.items ? onMouseEnter(section.id) : null" (mouseleave)="onMouseLeave()">
                    
                    <!-- Si tiene ítems (Dropdown) -->
                    <button *ngIf="section.items" class="nav-item group-hover:glow-cyan focus:outline-none"
                            [attr.aria-expanded]="activeDropdown === section.id">
                        {{ section.label | translate }}
                        <mat-icon class="icon transition-transform duration-300 group-hover:rotate-180">expand_more</mat-icon>
                    </button>

                    <!-- Si es link directo -->
                    <a *ngIf="section.link" [routerLink]="section.link" routerLinkActive="active-link" class="nav-item group-hover:glow-cyan">
                        {{ section.label | translate }}
                    </a>

                    <!-- Mega Menu / Dropdown -->
                    <div *ngIf="section.items" class="dropdown-panel">
                        <div class="dropdown-content">
                            <div class="py-2">
                                <ng-container *ngFor="let item of section.items">
                                    <!-- Regular Item -->
                                    <a *ngIf="!item.items" 
                                       [routerLink]="item.link"
                                       routerLinkActive="dropdown-active"
                                       class="dropdown-item">
                                        {{ item.label | translate }}
                                    </a>

                                    <!-- Nested Dropdown Item -->
                                    <div *ngIf="item.items" class="relative has-nested-dropdown">
                                        <div class="dropdown-item flex items-center gap-[10px] cursor-pointer group/nested">
                                            <a *ngIf="item.link" [routerLink]="item.link" routerLinkActive="dropdown-active" [routerLinkActiveOptions]="{exact: true}" class="hover:text-cyan-400 transition-colors">
                                                {{ item.label | translate }}
                                            </a>
                                            <span *ngIf="!item.link">{{ item.label | translate }}</span>
                                            <mat-icon class="text-xs opacity-50 transition-transform duration-300 group-hover/nested:translate-x-1 group-hover/nested:text-blue-400 !h-auto !w-auto translate-y-[1.5px]">chevron_right</mat-icon>
                                        </div>
                                        <div class="nested-dropdown">
                                            <div class="dropdown-content-premium py-2">
                                                <a *ngFor="let subItem of item.items" 
                                                   [routerLink]="subItem.link"
                                                   routerLinkActive="dropdown-active"
                                                   class="dropdown-item-premium">
                                                    {{ subItem.label | translate }}
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

            <!-- Language Switcher Desktop -->
            <div class="language-switcher">
               <button (click)="switchLanguage('es')" [class.active]="currentLang === 'es'" class="lang-btn">ES</button>
               <div class="divider"></div>
               <button (click)="switchLanguage('en')" [class.active]="currentLang === 'en'" class="lang-btn">EN</button>
            </div>
          </div>

          <!-- Mobile Menu Button (Hamburger) -->
          <div class="-mr-2 flex md:hidden items-center gap-2">
             <!-- Language Switcher Mobile -->
             <button (click)="toggleLanguage()" class="mobile-lang-btn">
                {{ currentLang | uppercase }}
             </button>

            <button (click)="toggleMobileMenu()" type="button" class="inline-flex items-center justify-center p-3 rounded-full text-cyan-400 hover:bg-cyan-900/40 transition-colors" aria-controls="mobile-menu" [attr.aria-expanded]="isMobileMenuOpen">
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
                <!-- Si tiene ítems (Mobile Dropdown) -->
                <button *ngIf="section.items" (click)="toggleMobileSection(section.id)" class="w-full text-left flex justify-between nav-item-mobile">
                    {{ section.label | translate }}
                    <mat-icon>{{ activeMobileSection === section.id ? 'expand_less' : 'expand_more' }}</mat-icon>
                </button>

                <!-- Si es link directo (Mobile) -->
                <a *ngIf="section.link" [routerLink]="section.link" (click)="closeMobileMenu()" class="w-full text-left block nav-item-mobile">
                    {{ section.label | translate }}
                </a>
                
                <div *ngIf="section.items && activeMobileSection === section.id" class="pl-4 space-y-1 mt-1 border-l-2 border-cyan-500/30">
                    <ng-container *ngFor="let item of section.items">
                        <!-- Regular Mobile Item -->
                        <a *ngIf="!item.items"
                           [routerLink]="item.link" 
                           (click)="closeMobileMenu()"
                           class="block px-3 py-3 rounded-lg text-base font-medium text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                           {{ item.label | translate }}
                        </a>
                        
                        <!-- Nested Mobile Item -->
                        <div *ngIf="item.items" class="space-y-1">
                            <div class="flex items-center justify-between nav-item-mobile pr-2">
                                <a *ngIf="item.link" [routerLink]="item.link" (click)="closeMobileMenu()" class="flex-grow">
                                    {{ item.label | translate }}
                                </a>
                                <span *ngIf="!item.link" class="flex-grow">
                                    {{ item.label | translate }}
                                </span>
                                <button (click)="toggleMobileSubSection(item.label)" class="p-2 hover:bg-cyan-500/10 rounded-lg transition-all">
                                    <mat-icon class="text-xl">{{ activeMobileSubSection === item.label ? 'expand_less' : 'expand_more' }}</mat-icon>
                                </button>
                            </div>
                            
                            <div *ngIf="activeMobileSubSection === item.label" 
                                 class="pl-4 border-l-2 border-cyan-800/30 space-y-1 mt-1">
                                <a *ngFor="let subItem of item.items" 
                                   [routerLink]="subItem.link" 
                                   (click)="closeMobileMenu()"
                                   class="block px-3 py-3 rounded-lg text-base font-medium text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                                   {{ subItem.label | translate }}
                                </a>
                            </div>
                        </div>
                    </ng-container>
                </div>
            </div>
        </div>
      </div>
    </nav>
  `,
   styles: [`
    .nav-item {
        @apply px-3 py-2 rounded-full text-[11px] font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 flex items-center gap-2;
        &.active-link {
            @apply text-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.2)];
        }
    }
    .icon {
        @apply text-lg w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all;
    }
    .dropdown-panel {
        @apply absolute left-1/2 transform -translate-x-1/2 mt-0 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 ease-out origin-top z-[1000] pt-3;
    }
    .dropdown-content {
        @apply rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] bg-[#020617]/95 backdrop-blur-2xl border border-white/10;
    }
    .dropdown-content-premium {
        @apply rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] bg-gradient-to-br from-[#020617]/95 via-[#0f172a]/95 to-[#1e1b4b]/95 backdrop-blur-2xl border border-blue-500/30;
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.1), 0 10px 40px rgba(0,0,0,0.8);
    }
    .nested-dropdown {
        @apply absolute left-full top-0 w-56 opacity-0 invisible transition-all duration-300 z-[1001] pl-2;
    }
    .has-nested-dropdown:hover .nested-dropdown {
        @apply opacity-100 visible translate-x-1;
    }
    .dropdown-item {
        @apply block px-4 py-3 text-sm text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-200 border-l-4 border-transparent hover:border-cyan-500 hover:pl-6;
        &.dropdown-active {
            @apply bg-cyan-500/5 text-cyan-400 border-l-cyan-500 pl-6;
        }
    }
    .dropdown-item-premium {
        @apply block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200 border-l-4 border-transparent hover:border-blue-400 hover:pl-6;
        &:hover {
           text-shadow: 0 0 8px rgba(96, 165, 250, 0.5);
        }
        &.dropdown-active {
            @apply bg-blue-500/10 text-white border-l-purple-500 pl-6;
        }
    }
    .nav-item-mobile {
        @apply px-3 py-3 rounded-xl text-lg font-medium text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all flex items-center gap-3;
    }
    .glow-cyan {
        text-shadow: 0 0- 10px rgba(34, 211, 238, 0.8);
        @apply text-cyan-400;
    }

    /* Language Switcher Avatar Style */
    .language-switcher {
       display: flex;
       align-items: center;
       background: rgba(10, 14, 20, 0.4);
       padding: 0.25rem 0.5rem;
       border-radius: 50px;
       border: 1px solid rgba(0, 242, 255, 0.2);
       backdrop-filter: blur(15px);
       box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
       margin-left: 2rem;
    }

    .lang-btn {
       background: transparent;
       border: none;
       color: rgba(255, 255, 255, 0.5);
       padding: 0.25rem 0.75rem;
       font-size: 0.75rem;
       font-weight: 700;
       cursor: pointer;
       transition: all 0.3s ease;
       border-radius: 50px;

       &.active {
          color: #00f2ff;
          text-shadow: 0 0 8px rgba(0, 242, 255, 0.5);
          background: rgba(0, 242, 255, 0.1);
       }

       &:hover:not(.active) {
          color: rgba(255, 255, 255, 0.9);
       }
    }

    .divider {
       width: 1px;
       height: 12px;
       background: rgba(255, 255, 255, 0.1);
       margin: 0 0.25rem;
    }

    .mobile-lang-btn {
       background: rgba(0, 242, 255, 0.1);
       border: 1px solid rgba(0, 242, 255, 0.3);
       color: #00f2ff;
       padding: 0.5rem 1rem;
       border-radius: 50px;
       font-size: 0.8rem;
       font-weight: 800;
       backdrop-filter: blur(10px);
    }
  `]
})
export class NavMenuComponent {
   isMobileMenuOpen = false;
   activeDropdown: string | null = null;
   activeMobileSection: string | null = null;
   activeMobileSubSection: string | null = null;

   get currentLang() {
      return this.translate.currentLang || 'es';
   }

   menuItems = [
      {
         id: 'animales',
         label: 'COMMON.ANIMALS',
         items: [
            {
               label: 'COMMON.MAMMALS',
               link: '/amazonia/animales/mamiferos-terrestres',
               items: [
                  { label: 'Jaguar', link: '/amazonia/animales/mamiferos-terrestres/jaguar' },
                  { label: 'Pecari', link: '/amazonia/animales/mamiferos-terrestres/pecari' },
                  { label: 'Tapir', link: '/amazonia/animales/mamiferos-terrestres/tapir' }
               ]
            },
            {
               label: 'COMMON.BIRDS',
               link: '/amazonia/animales/aves',
               items: [
                  { label: 'Tucán', link: '/amazonia/animales/aves/tucan' }
               ]
            },
            { label: 'COMMON.REPTILES', link: '/amazonia/animales/reptiles-anfibios' },
            { label: 'COMMON.AQUATIC_FAUNA', link: '/amazonia/animales/fauna-acuatica' }
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
                  { label: 'Ayahuasca', link: '/amazonia/plantas/medicinales/ayahuasca' },
                  { label: 'Sangre de Grado', link: '/amazonia/plantas/medicinales/sangre-de-grado' },
                  { label: 'Uña de Gato', link: '/amazonia/plantas/medicinales/una-de-gato' }
               ]
            },
            { label: 'COMMON.VERTICAL_FOREST', link: '/amazonia/plantas/bosque-vertical' },
            { label: 'COMMON.FLORA_TYPES', link: '/amazonia/plantas/tipos-flora' },
            { label: 'COMMON.ETHNOBOTANY', link: '/amazonia/plantas/etnobotanica-usos' }
         ]
      },
      {
         id: 'insectos',
         label: 'COMMON.INSECTS',
         items: [
            { label: 'COMMON.SOCIAL_BIOLOGY', link: '/amazonia/insectos/biologia-social' },
            { label: 'COMMON.BUTTERFLIES', link: '/amazonia/insectos/mariposas-polillas' },
            { label: 'COMMON.SPIDERS', link: '/amazonia/insectos/aranas-invertebrados' },
            { label: 'COMMON.FOOD_CHAIN', link: '/amazonia/insectos/cadena-trofica' }
         ]
      },
      {
         id: 'reservas',
         label: 'COMMON.GEOGRAPHY',
         items: [
            { label: 'COMMON.MAP', link: '/amazonia/reservas/mapa' },
            { label: 'COMMON.MANU', link: '/amazonia/geografia/manu' },
            { label: 'COMMON.YASUNI', link: '/amazonia/geografia/yasuni' },
            { label: 'COMMON.JAU', link: '/amazonia/geografia/jau' },
            { label: 'COMMON.PACAYA', link: '/amazonia/geografia/pacaya' },
            { label: 'COMMON.CHIRIBIQUETE', link: '/amazonia/geografia/chiribiquete' }
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
                  { label: 'COMMON.WAORANI', link: '/amazonia/tribus/etnias/waorani' }
               ]
            },
            { label: 'COMMON.CULTURE_SOCIETY', link: '/amazonia/tribus/cultura-sociedad' },
            { label: 'COMMON.ANCESTRAL_KNOWLEDGE', link: '/amazonia/tribus/conocimiento-ancestral' },
            { label: 'COMMON.CHALLENGES', link: '/amazonia/tribus/desafios-supervivencia' }
         ]
      },
      {
         id: 'conservacion',
         label: 'COMMON.CONSERVATION',
         items: [
            { label: 'COMMON.DEFORESTATION', link: '/amazonia/conservacion/deforestacion-mineria' },
            { label: 'COMMON.CLIMATE_CHANGE', link: '/amazonia/conservacion/cambio-climatico' },
            { label: 'COMMON.PROJECTS', link: '/amazonia/conservacion/proyectos-soluciones' }
         ]
      },
      {
         id: 'recursos',
         label: 'COMMON.RESOURCES',
         items: [
            { label: 'COMMON.BOOKS', link: '/amazonia/recursos/libros' },
            { label: 'COMMON.DOCUMENTARIES', link: '/amazonia/recursos/documentales' },
            { label: 'COMMON.MOVIES', link: '/amazonia/recursos/peliculas' },
            { label: 'COMMON.RESEARCH', link: '/amazonia/recursos/investigacion' }
         ]
      },
      {
         id: 'exploracion',
         label: 'COMMON.EXPLORATION',
         items: [
            { label: 'COMMON.HISTORY', link: '/amazonia/exploracion/historia' },
            { label: 'COMMON.SURVIVAL', link: '/amazonia/exploracion/supervivencia' }
         ]
      },
      {
         id: 'contacto',
         label: 'COMMON.CONTACT',
         link: '/amazonia/contacto'
      }
   ];

   constructor(private translate: TranslateService) { }

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

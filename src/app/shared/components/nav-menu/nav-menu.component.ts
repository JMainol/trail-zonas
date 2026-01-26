
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
   selector: 'app-nav-menu',
   standalone: true,
   imports: [RouterLink, RouterLinkActive, CommonModule, MatIconModule],
   template: `
    <nav class="sticky top-0 z-[100] w-full bg-[#020617]/80 backdrop-blur-xl border-b border-[#1e293b] shadow-[0_4px_30px_rgba(0,0,0,0.5)]" aria-label="Menú Principal">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo / Home Link -->
          <div class="flex-shrink-0 flex items-center">
            <a routerLink="/" class="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:scale-105 transition-all cursor-pointer tracking-tighter filter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              AMAZONAS JUNGLE
            </a>
          </div>
          
          <!-- Desktop Menu -->
          <div class="hidden md:block w-full">
            <ul class="flex items-center justify-center space-x-2">
              
              <!-- Inicio -->
              <li>
                <a routerLink="/" 
                   routerLinkActive="active-link" 
                   [routerLinkActiveOptions]="{exact: true}"
                   class="nav-item">
                   <mat-icon class="icon">home</mat-icon>
                   Inicio
                </a>
              </li>

              <!-- Generador de Secciones -->
              <ng-container *ngFor="let section of menuItems">
                <li class="relative group" (mouseenter)="onMouseEnter(section.id)" (mouseleave)="onMouseLeave()">
                    
                    <button class="nav-item group-hover:glow-cyan focus:outline-none"
                            [attr.aria-expanded]="activeDropdown === section.id">
                        {{ section.label }}
                        <mat-icon class="icon transition-transform duration-300 group-hover:rotate-180">expand_more</mat-icon>
                    </button>

                    <!-- Mega Menu / Dropdown -->
                    <div class="dropdown-panel">
                        <div class="dropdown-content">
                            <div class="py-2">
                                <a *ngFor="let item of section.items" 
                                   [routerLink]="item.link"
                                   routerLinkActive="dropdown-active"
                                   class="dropdown-item">
                                    {{ item.label }}
                                </a>
                            </div>
                        </div>
                    </div>
                </li>
              </ng-container>

            </ul>
          </div>

          <!-- Mobile Menu Button (Hamburger) -->
          <div class="-mr-2 flex md:hidden">
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
            <a routerLink="/" (click)="closeMobileMenu()" class="nav-item-mobile">Inicio</a>
            
            <div *ngFor="let section of menuItems" class="space-y-1">
                <button (click)="toggleMobileSection(section.id)" class="w-full text-left flex justify-between nav-item-mobile">
                    {{ section.label }}
                    <mat-icon>{{ activeMobileSection === section.id ? 'expand_less' : 'expand_more' }}</mat-icon>
                </button>
                
                <div *ngIf="activeMobileSection === section.id" class="pl-4 space-y-1 mt-1 border-l-2 border-cyan-500/30">
                    <a *ngFor="let item of section.items" 
                       [routerLink]="item.link" 
                       (click)="closeMobileMenu()"
                       class="block px-3 py-3 rounded-lg text-base font-medium text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                       {{ item.label }}
                    </a>
                </div>
            </div>
        </div>
      </div>
    </nav>
  `,
   styles: [`
    .nav-item {
        @apply px-4 py-2 rounded-full text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 flex items-center gap-2;
        &.active-link {
            @apply text-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.2)];
        }
    }
    .icon {
        @apply text-lg w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all;
    }
    .dropdown-panel {
        @apply absolute left-1/2 transform -translate-x-1/2 mt-0 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 ease-out origin-top z-[100] pt-3;
    }
    .dropdown-content {
        @apply rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden bg-[#020617]/95 backdrop-blur-2xl border border-white/10;
    }
    .dropdown-item {
        @apply block px-4 py-3 text-sm text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-200 border-l-4 border-transparent hover:border-cyan-500 hover:pl-6;
        &.dropdown-active {
            @apply bg-cyan-500/5 text-cyan-400 border-l-cyan-500 pl-6;
        }
    }
    .nav-item-mobile {
        @apply px-3 py-3 rounded-xl text-lg font-medium text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all flex items-center gap-3;
    }
    .glow-cyan {
        text-shadow: 0 0 10px rgba(34, 211, 238, 0.8);
        @apply text-cyan-400;
    }
  `]
})
export class NavMenuComponent {
   isMobileMenuOpen = false;
   activeDropdown: string | null = null;
   activeMobileSection: string | null = null;

   menuItems = [
      {
         id: 'animales',
         label: 'Animales',
         items: [
            { label: 'Mamíferos Terrestres', link: '/amazonia/animales/mamiferos-terrestres' },
            { label: 'Aves Amazónicas', link: '/amazonia/animales/aves-amazonicas' },
            { label: 'Reptiles y Anfibios', link: '/amazonia/animales/reptiles-anfibios' },
            { label: 'Fauna Acuática', link: '/amazonia/animales/fauna-acuatica' }
         ]
      },
      {
         id: 'plantas',
         label: 'Plantas',
         items: [
            { label: 'El Bosque Vertical', link: '/amazonia/plantas/bosque-vertical' },
            { label: 'Tipos de Flora', link: '/amazonia/plantas/tipos-flora' },
            { label: 'Etnobotánica', link: '/amazonia/plantas/etnobotanica-usos' },
            { label: 'Medicinales', link: '/amazonia/plantas/medicinales' }
         ]
      },
      {
         id: 'insectos',
         label: 'Insectos',
         items: [
            { label: 'Biología Social', link: '/amazonia/insectos/biologia-social' },
            { label: 'Mariposas y Polillas', link: '/amazonia/insectos/mariposas-polillas' },
            { label: 'Arañas e Invertebrados', link: '/amazonia/insectos/aranas-invertebrados' },
            { label: 'Cadena Trófica', link: '/amazonia/insectos/cadena-trofica' }
         ]
      },
      {
         id: 'tribus',
         label: 'Tribus',
         items: [
            { label: 'Etnias y Regiones', link: '/amazonia/tribus/etnias-regiones' },
            { label: 'Cultura y Sociedad', link: '/amazonia/tribus/cultura-sociedad' },
            { label: 'Conocimiento Ancestral', link: '/amazonia/tribus/conocimiento-ancestral' },
            { label: 'Desafíos', link: '/amazonia/tribus/desafios-supervivencia' }
         ]
      },
      {
         id: 'geografia',
         label: 'Geografía',
         items: [
            { label: 'Río y Afluentes', link: '/amazonia/geografia/rio-afluentes' },
            { label: 'Clima', link: '/amazonia/geografia/clima-estacionalidad' },
            { label: 'Geología', link: '/amazonia/geografia/geologia-suelos' }
         ]
      },
      {
         id: 'ecosistemas',
         label: 'Acuáticos',
         items: [
            { label: 'Várzea e Igapó', link: '/amazonia/ecosistemas-acuaticos/varzea-igapo' },
            { label: 'Lagos y Cochas', link: '/amazonia/ecosistemas-acuaticos/lagos-cochas' }
         ]
      },
      {
         id: 'conservacion',
         label: 'Conservación',
         items: [
            { label: 'Deforestación', link: '/amazonia/conservacion/deforestacion-mineria' },
            { label: 'Cambio Climático', link: '/amazonia/conservacion/cambio-climatico' },
            { label: 'Proyectos y Soluciones', link: '/amazonia/conservacion/proyectos-soluciones' }
         ]
      }
   ];

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
      }
   }

   closeMobileMenu() {
      this.isMobileMenuOpen = false;
      this.activeMobileSection = null;
   }
}

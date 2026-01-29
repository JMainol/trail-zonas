
import { ChangeDetectionStrategy, Component, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

// Importación de librerías externas
import gsap from 'gsap';

import ScrollTrigger from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/all';
import SplitType from 'split-type';

import Lenis from 'lenis';

/**
 * Componente de Página de Inicio.
 * Muestra la sección Hero y una galería de destaques cargada de forma diferida.
 * Utiliza @defer para optimizar la carga inicial (Core Web Vitals).
 * Implementa un efecto de resaltado de texto on-scroll.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None // Necesario para que los estilos afecten a los elementos generados por SplitType
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  /**
   * Instancia de Lenis para el scroll suave.
   */
  private lenis: Lenis | null = null;

  /**
   * Lista de animales destacados para la galería.
   * En una aplicación real, esto vendría de un servicio/signal.
   */
  featuredAnimals = [
    { title: 'Rana de Cristal', description: 'Guardianes translúcidos de los arroyos mágicos.', color: '#39ff14' },
    { title: 'Jaguar Místico', description: 'El depredador alfa bajo la luz de Pandora.', color: '#bc13fe' },
    { title: 'Hongo Bioluminiscente', description: 'Faros naturales en las profundidades de la selva.', color: '#00f2ff' }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private el: ElementRef
  ) { }


  /**
   * Inicialización de animaciones y librerías una vez que la vista está lista.
   * Se ejecuta solo en el navegador para evitar errores de SSR.
   */
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('HomeComponent: View initialized (Browser)');
      try {
        this.initSmoothScroll();
        this.initTextRevealAnimation();
      } catch (error) {
        console.error('HomeComponent: Error initializing animations', error);
      }
    }
  }

  /**
   * Limpieza de recursos al destruir el componente.
   */
  ngOnDestroy(): void {
    if (this.lenis) {
      this.lenis.destroy();
    }
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  /**
   * Configura Lenis para un efecto de scroll inercial suave.
   */
  private initSmoothScroll(): void {
    console.log('HomeComponent: Initializing Lenis');
    this.lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true
    });

    this.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      this.lenis?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }


  /**
   * Configura el efecto de resaltado de texto usando SplitType y GSAP ScrollTrigger.
   */


  private initTextRevealAnimation(): void {
    console.log('HomeComponent: Initializing Text Reveal (Refined)');
    gsap.registerPlugin(ScrollTrigger);

    // 1. Configuración Global: Opacidad al hacer scroll (efecto base)
    // EXCLUYENDO elementos que tienen efectos especiales (.hx) para evitar conflictos
    const splitTypes = document.querySelectorAll('.content__text');

    splitTypes.forEach((block) => {
      // Usamos SplitType para dividir en caracteres
      const text = new SplitType(block as HTMLElement, { types: 'words,chars' });

      // Filtramos los caracteres que NO están dentro de un .hx
      const baseChars = Array.from(text.chars || []).filter(char => !char.closest('.hx'));

      // Animación Base de Aparición solo para texto normal
      if (baseChars.length > 0) {
        gsap.fromTo(baseChars,
          {
            opacity: 0.2
          },
          {
            scrollTrigger: {
              trigger: block,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: true,
              markers: false
            },
            opacity: 1,
            stagger: 0.1,
          }
        );
      }
    });


    // 5. Efecto Específico: HX-4 (Double Color)
    const hx4Elements = document.querySelectorAll('.hx-4');
    hx4Elements.forEach(el => {
      const chars = el.querySelectorAll('.char');

      const defaults = { duration: 0.3, ease: 'power3.in' };
      const color1 = getComputedStyle(el).getPropertyValue('--color-highlight-end');
      const color2 = getComputedStyle(el).getPropertyValue('--color-highlight-end-alt');

      const animateChars = () => {
        gsap.timeline({ defaults: defaults })
          .set(chars, { willChange: 'transform, opacity, color' })
          .to(chars, {
            stagger: 0.05,
            scale: 1.45,
            color: color1,
          })
          .to(chars, {
            duration: 0.4,
            ease: 'sine',
            stagger: 0.05,
            scale: 1,
            color: color2,
          }, defaults.duration);
      };

      const resetChars = () => {
        gsap.killTweensOf(chars);
        gsap.set(chars, {
          scale: 1,
          color: ''
        });
      };

      // Aseguramos estado inicial
      gsap.set(chars, { opacity: 1 });


      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        onEnter: () => animateChars(),
        onEnterBack: () => animateChars(),
        onLeave: () => resetChars(),
        onLeaveBack: () => resetChars()
      });
    });


    // 8. Efecto Específico: HX-7 (Height Reveal)
    const hx7Elements = document.querySelectorAll('.hx-7');
    hx7Elements.forEach(el => {
      const chars = el.querySelectorAll('.char');
      const defaults = { duration: 0.2, ease: 'sine' };

      const animateChars = () => {
        const tl = gsap.timeline({ defaults: defaults });

        // 1. ScaleY de 0 a 1 para los caracteres (aparecen creciendo verticalmente)
        tl.fromTo(chars,
          {
            transformOrigin: '50% 80%',
            scaleY: 0,
            opacity: 1 // Aseguramos que sean visibles para el efecto de escala
          },
          {
            stagger: pos => 0.2 + 0.05 * pos,
            scaleY: 1
          }
        )
          // 2. Animar altura del fondo
          .fromTo(el,
            {
              '--after-height': '0%',
              willChange: 'height'
            },
            {
              duration: 0.7,
              ease: 'sine.inOut',
              '--after-height': getComputedStyle(el).getPropertyValue('--after-height-final') || '100%'
            },
            '<' // Sincronizado con el inicio
          );
      };

      const resetChars = () => {
        gsap.killTweensOf([chars, el]);
        gsap.set(el, { '--after-height': '0%' });
        gsap.set(chars, { scaleY: 1 });
      };

      // Estado inicial
      gsap.set(el, { '--after-height': '0%' });
      gsap.set(chars, { opacity: 1 });


      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        onEnter: () => animateChars(),
        onEnterBack: () => animateChars(),
        onLeave: () => resetChars(),
        onLeaveBack: () => resetChars()
      });
    });

    // 9. Efecto Específico: HX-8 (Word Rotation & Color)
    const hx8Elements = document.querySelectorAll('.hx-8');
    hx8Elements.forEach(el => {
      // Este efecto requiere palabras (.word), así que aplicamos SplitType localmente
      const split = new SplitType(el as HTMLElement, { types: 'words' });
      const words = split.words || [];

      const defaults = { duration: 1.2, ease: 'elastic.out(0.7)' };

      const animateWords = () => {
        const tl = gsap.timeline({ defaults: defaults });

        // Configurar punto de transformación inicial
        gsap.set(words, { transformOrigin: '0% 50%' });

        tl.fromTo(words,
          {
            opacity: 0,
            rotationZ: -30
          },
          {
            stagger: 0.2,
            opacity: 1,
            rotationZ: 0,
            color: getComputedStyle(el).getPropertyValue('--color-highlight-end') || '#c3c58c'
          }
        );
      };

      const resetWords = () => {
        gsap.killTweensOf(words);
        gsap.set(words, {
          opacity: 1,
          rotationZ: 0,
          color: ''
        });
      };

      // Estado inicial
      gsap.set(words, { opacity: 1 });


      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        onEnter: () => animateWords(),
        onEnterBack: () => animateWords(),
        onLeave: () => resetWords(),
        onLeaveBack: () => resetWords()
      });
    });



  }



}


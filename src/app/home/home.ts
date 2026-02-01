import { ChangeDetectionStrategy, Component, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil, delay } from 'rxjs';

// ImportaciÃ³n de librerÃ­as externas
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import Lenis from 'lenis';

/**
 * Componente de PÃ¡gina de Inicio.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    TranslateModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private lenis: Lenis | null = null;
  private destroy$ = new Subject<void>();

  contentTitle: string = '';
  contentTexts: string[] = [];
  private splitInstances: SplitType[] = [];

  featuredAnimals = [
    { title: 'Rana de Cristal', description: 'Guardianes translÃºcidos de los arroyos mÃ¡gicos.', color: '#39ff14' },
    { title: 'Jaguar MÃ­stico', description: 'El depredador alfa bajo la luz de Pandora.', color: '#bc13fe' },
    { title: 'Hongo Bioluminiscente', description: 'Faros naturales en las profundidades de la selva.', color: '#00f2ff' }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private el: ElementRef,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initSmoothScroll();
      // Re-inicializar cuando el idioma cambie
      this.translate.onLangChange
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.refreshPageContent();
        });

      // Carga inicial
      this.refreshPageContent();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.lenis) {
      this.lenis.destroy();
    }
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  private refreshPageContent(): void {
    // 1. Revertir animaciones para limpiar el DOM
    this.revertAnimations();

    // 2. Obtener traducciones
    const titleKey = 'HOME.DISCOVER_AMAZON.TITLE';
    const textKeys = [
      'HOME.DISCOVER_AMAZON.TEXT_1',
      'HOME.DISCOVER_AMAZON.TEXT_2',
      'HOME.DISCOVER_AMAZON.TEXT_3',
      'HOME.DISCOVER_AMAZON.TEXT_4',
      'HOME.DISCOVER_AMAZON.TEXT_5',
      'HOME.DISCOVER_AMAZON.TEXT_6'
    ];

    // Combinamos todas las claves para una sola suscripción
    this.translate.get([titleKey, ...textKeys]).subscribe(translations => {
      this.contentTitle = translations[titleKey];
      this.contentTexts = textKeys.map(key => translations[key]);

      // 3. Forzar actualización del DOM
      this.cdr.detectChanges();

      // 4. Inicializar animaciones
      // Pequeño delay para asegurar que el DOM está listo
      setTimeout(() => {
        this.initTextRevealAnimation();
        ScrollTrigger.refresh();
      }, 50);
    });
  }

  private revertAnimations(): void {
    // Revertir SplitType para restaurar el HTML original limpio
    this.splitInstances.forEach(instance => instance.revert());
    this.splitInstances = [];

    // Matar triggers
    ScrollTrigger.getAll().forEach(t => {
      const triggerEl = t.trigger as HTMLElement;
      if (triggerEl && (triggerEl.classList?.contains('content__text') ||
        triggerEl.classList?.contains('hx') ||
        triggerEl.classList?.contains('hx-4') ||
        triggerEl.classList?.contains('hx-7') ||
        triggerEl.classList?.contains('hx-8'))) {
        t.kill();
      }
    });
  }

  private initSmoothScroll(): void {
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

  private initTextRevealAnimation(): void {
    gsap.registerPlugin(ScrollTrigger);
    this.splitInstances = [];
    const splitTypes = document.querySelectorAll('.content__text');

    splitTypes.forEach((block) => {
      const text = new SplitType(block as HTMLElement, { types: 'words,chars' });
      this.splitInstances.push(text);
      const baseChars = Array.from(text.chars || []).filter(char => !char.closest('.hx'));

      if (baseChars.length > 0) {
        gsap.fromTo(baseChars,
          { opacity: 0.2 },
          {
            scrollTrigger: {
              trigger: block,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: true
            },
            opacity: 1,
            stagger: 0.1,
          }
        );
      }
    });

    // HX-4
    const hx4Elements = document.querySelectorAll('.hx-4');
    hx4Elements.forEach(el => {
      const chars = el.querySelectorAll('.char');
      const defaults = { duration: 0.3, ease: 'power3.in' };
      const color1 = getComputedStyle(el).getPropertyValue('--color-highlight-end');
      const color2 = getComputedStyle(el).getPropertyValue('--color-highlight-end-alt');
      const animateChars = () => {
        gsap.timeline({ defaults: defaults })
          .set(chars, { willChange: 'transform, opacity, color' })
          .to(chars, { stagger: 0.05, scale: 1.45, color: color1 })
          .to(chars, { duration: 0.4, ease: 'sine', stagger: 0.05, scale: 1, color: color2 }, defaults.duration);
      };
      const resetChars = () => {
        gsap.killTweensOf(chars);
        gsap.set(chars, { scale: 1, color: '' });
      };
      gsap.set(chars, { opacity: 1 });
      ScrollTrigger.create({
        trigger: el, start: 'top 80%',
        onEnter: animateChars, onEnterBack: animateChars,
        onLeave: resetChars, onLeaveBack: resetChars
      });
    });

    // HX-7
    const hx7Elements = document.querySelectorAll('.hx-7');
    hx7Elements.forEach(el => {
      const chars = el.querySelectorAll('.char');
      const defaults = { duration: 0.2, ease: 'sine' };
      const animateChars = () => {
        const tl = gsap.timeline({ defaults: defaults });
        tl.fromTo(chars, { transformOrigin: '50% 80%', scaleY: 0, opacity: 1 }, { stagger: pos => 0.2 + 0.05 * pos, scaleY: 1 })
          .fromTo(el, { '--after-height': '0%', willChange: 'height' }, { duration: 0.7, ease: 'sine.inOut', '--after-height': getComputedStyle(el).getPropertyValue('--after-height-final') || '100%' }, '<');
      };
      const resetChars = () => {
        gsap.killTweensOf([chars, el]);
        gsap.set(el, { '--after-height': '0%' });
        gsap.set(chars, { scaleY: 1 });
      };
      gsap.set(el, { '--after-height': '0%' });
      gsap.set(chars, { opacity: 1 });
      ScrollTrigger.create({
        trigger: el, start: 'top 80%',
        onEnter: animateChars, onEnterBack: animateChars,
        onLeave: resetChars, onLeaveBack: resetChars
      });
    });

    // HX-8
    const hx8Elements = document.querySelectorAll('.hx-8');
    hx8Elements.forEach(el => {
      const split = new SplitType(el as HTMLElement, { types: 'words' });
      const words = split.words || [];
      const defaults = { duration: 1.2, ease: 'elastic.out(0.7)' };
      const animateWords = () => {
        const tl = gsap.timeline({ defaults: defaults });
        gsap.set(words, { transformOrigin: '0% 50%' });
        tl.fromTo(words, { opacity: 0, rotationZ: -30 }, { stagger: 0.2, opacity: 1, rotationZ: 0, color: getComputedStyle(el).getPropertyValue('--color-highlight-end') || '#c3c58c' });
      };
      const resetWords = () => {
        gsap.killTweensOf(words);
        gsap.set(words, { opacity: 1, rotationZ: 0, color: '' });
      };
      gsap.set(words, { opacity: 1 });
      ScrollTrigger.create({
        trigger: el, start: 'top 80%',
        onEnter: animateWords, onEnterBack: animateWords,
        onLeave: resetWords, onLeaveBack: resetWords
      });
    });
  }
}

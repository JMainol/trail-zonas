
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
      const text = new SplitType(block as HTMLElement, { types: 'chars' });

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

    // 2. Efecto Específico: HX-1 (3D Flip)
    const hx1Elements = document.querySelectorAll('.hx-1');
    hx1Elements.forEach(el => {
      const chars = el.querySelectorAll('.char');
      gsap.fromTo(chars,
        {
          opacity: 0,
          z: -300,
          rotationX: 90
        },
        {
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'top 40%',
            scrub: true
          },
          opacity: 1,
          z: 0,
          rotationX: 0,
          stagger: 0.05
        }
      );
    });

    // 3. Efecto Específico: HX-2 (Flicker)
    const hx2Elements = document.querySelectorAll('.hx-2');
    hx2Elements.forEach(el => {
      const chars = el.querySelectorAll('.char');
      const animateChars = () => {
        chars.forEach((char, index) => {
          gsap.timeline()
            .to(char, {
              delay: index * 0.05,
              opacity: 0,
              repeat: 2,
              yoyo: true,
              duration: 0.1
            })
            .to(char, { opacity: 1, duration: 0.1 });
        });
      };

      // Reseteamos opacidad a 1 por si acaso, aunque el efecto flicker juega con ella
      gsap.set(chars, { opacity: 1 });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        onEnter: () => animateChars(),
        onEnterBack: () => animateChars()
      });
    });

    // 4. Efecto Específico: HX-3 (Neon Green / Color Shift)
    const hx3Elements = document.querySelectorAll('.hx-3');
    hx3Elements.forEach(el => {
      const chars = el.querySelectorAll('.char');

      // Configuración exacta del efecto 3 de Codrops
      // Importante: duration, stagger y propiedades visuales
      const defaults = { duration: 0.5, ease: 'power1' };
      const highlightColor = getComputedStyle(el).getPropertyValue('--color-highlight-end') || '#39ff14';

      // Color del glow: En el original es #ffdbf5 (rosa pálido) sobre texto rosa. 
      // Aquí usamos un verde muy pálido o blanco para el core, o el propio verde neon para el glow.
      // Si usamos el mismo color para el drop-shadow 20px, será muy intenso.

      const animateChars = () => {
        gsap.timeline({ defaults: defaults })
          .set(chars, { willChange: 'transform, opacity, color, filter' })
          .to(chars, {
            stagger: 0.06,
            opacity: 0,
            scale: 0.8,
            duration: 0 // Set inicial inmediato al dispararse
          })
          .to(chars, {
            stagger: 0.06,
            opacity: 1,
            scale: 1,
            color: highlightColor,
            startAt: { filter: 'drop-shadow(0px 0px 0px transparent)' },
            // Aumentamos a 20px como el original, y usamos el color de highlight para el glow
            filter: `drop-shadow(0px 0px 20px ${highlightColor})`
          });
      };

      const resetChars = () => {
        gsap.killTweensOf(chars);
        gsap.set(chars, {
          scale: 1,
          opacity: 1, // Volvemos a opacity 1 pero sin color highlight, o quizás debería volver a gris/base?
          // El original vuelve a "color: ''" (hereda del padre) y "opacity: 1".
          // Y como nuestro padre .hx tiene color base...
          color: '',
          filter: 'drop-shadow(0px 0px 0px transparent)'
        });
        // Importante: Si el global no afecta a estos, al resetearse deben quedar visibles (opacity 1) pero en su estado "inactivo".
        // Como 'initTextRevealAnimation' global los ignora, su opacidad base depende del CSS.
        // En CSS .content__text tiene color #444. 
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

    // 6. Efecto Específico: HX-5 (Background Scale)
    const hx5Elements = document.querySelectorAll('.hx-5');

    hx5Elements.forEach(el => {
      const chars = el.querySelectorAll('.char');
      const defaults = { duration: 0.4, ease: 'power1' };

      const animateChars = () => {
        const tl = gsap.timeline({ defaults: defaults });

        // Animamos los caracteres: Scale 1.3 -> 1, Opacity 0 -> 1
        tl.fromTo(chars,
          {
            scale: 1.3,
            opacity: 0
          },
          {
            stagger: pos => 0.1 + 0.05 * pos,
            scale: 1,
            opacity: 1
          }
        )
          // Animamos el fondo (pseudo-elemento) vía variable CSS
          .fromTo(el,
            {
              '--after-scale': 0
            },
            {
              duration: 0.8,
              ease: 'expo',
              '--after-scale': 1
            },
            0 // Insert at start time 0
          );
      };

      const resetChars = () => {
        gsap.killTweensOf([chars, el]);
        gsap.set(el, { '--after-scale': 0 });
        gsap.set(chars, { opacity: 1, scale: 1 }); // Estado base visible
      };

      // Estado inicial
      gsap.set(el, { '--after-scale': 0 });
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

    // 7. Efecto Específico: HX-6 (Rotation & Scale - Staggered Reveal)
    const hx6Elements = document.querySelectorAll('.hx-6');
    hx6Elements.forEach(el => {
      const chars = el.querySelectorAll('.char');
      const defaults = { duration: 0.1, ease: 'sine' };

      const animateChars = () => {
        const tl = gsap.timeline({ defaults: defaults });

        // 1. Fade out caracteres con stagger reverso
        tl.to(chars, {
          stagger: (pos, _, arr) => 0.06 * (arr.length - 1 - pos),
          opacity: 0,
          duration: 0.1
        })
          // 2. Fade in caracteres con stagger normal
          .to(chars, {
            stagger: pos => 0.2 + 0.05 * pos,
            opacity: 1,
            duration: 0.1
          })
          // 3. Animar ancho del pseudo-elemento (fondo) simultáneamente con el fade in
          // Usamos '<' para que empiece al mismo tiempo que el anterior
          .fromTo(el,
            {
              '--after-width': '0%',
              willChange: 'height'
            },
            {
              duration: 1,
              ease: 'power4',
              '--after-width': getComputedStyle(el).getPropertyValue('--after-width-final') || '105%'
            },
            '<'
          );
      };

      const resetChars = () => {
        gsap.killTweensOf([chars, el]);
        gsap.set(el, { '--after-width': '0%' });
        gsap.set(chars, { opacity: 1 });
      };

      // Estado inicial
      gsap.set(el, { '--after-width': '0%' });
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

    // 10. Efecto Específico: HX-9 (Ghost Clone / Spirit Reveal)
    const hx9Elements = document.querySelectorAll('.hx-9');

    hx9Elements.forEach(el => {
      // 1. Dividir en Palabras y Caracteres
      const split = new SplitType(el as HTMLElement, { types: 'words,chars' });
      // Nota: Codrops asume que solo hay 1 palabra en el target, trabajaremos con la primera .word
      const originalWord = el.querySelector('.word');

      if (!originalWord) return;

      // 2. Clonar la palabra y añadirla al DOM
      const clone = originalWord.cloneNode(true) as HTMLElement;
      el.appendChild(clone);

      // Referencias a los caracteres
      const charsOriginal = originalWord.querySelectorAll('.char');
      const charsClone = clone.querySelectorAll('.char');

      const defaults = { duration: 0.2, ease: 'sine' };

      // Configuración inicial de rotaciones aleatorias para el original (que viene de "la nada")
      const rotations = Array.from(charsOriginal, () => gsap.utils.random(-45, 45));

      const animateChars = () => {
        const tl = gsap.timeline({ defaults: defaults });

        // Animación Principal (Original): Aparece y se asienta
        tl.fromTo(charsOriginal,
          {
            opacity: 0,
            yPercent: 80,
            rotation: (i) => rotations[i]
          },
          {
            stagger: 0.06,
            opacity: 1,
            yPercent: 0,
            rotation: 0
          }
        )
          // Animación del Clon (Fantasma): Explota hacia arriba y desaparece
          .to(charsClone,
            {
              duration: 1,
              ease: 'expo',
              stagger: 0.06,
              xPercent: () => gsap.utils.random(-15, 15),
              yPercent: () => gsap.utils.random(-130, -50),
              rotation: (i) => -1 * (rotations[i] as number),
              scale: () => gsap.utils.random(1, 2),
              opacity: 0
            },
            0 // Sincronizado con el inicio
          );
      };

      const resetChars = () => {
        gsap.killTweensOf([charsOriginal, charsClone, el]);
        // Reset original
        gsap.set(charsOriginal, {
          opacity: 1,
          xPercent: 0,
          yPercent: 0,
          rotation: 0,
          scale: 1
        });
        // Reset clon (debe estar visible inicialmente para volar luego? No, el clon simula ser el texto que "se va" o "sale")
        // En la lógica de animación, el clon empieza donde está (que es posición absoluta sobre el original) y vuela.
        gsap.set(charsClone, {
          opacity: 1, // Visible al inicio para poder volar
          xPercent: 0,
          yPercent: 0,
          rotation: 0,
          scale: 1
        });
      };

      // Limpieza al destruir componente (opcional pero buena práctica: remover clon)
      // En este caso, como lo añadimos dinámicamente, al recargar o cambiar ruta podría duplicarse si no tenemos cuidado.
      // Pero Angular destruye el componente y recrea el DOM, así que está bien.

      // Estado Inicial
      resetChars();


      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        onEnter: () => animateChars(),
        onEnterBack: () => animateChars(),
        onLeave: () => resetChars(),
        onLeaveBack: () => resetChars()
      });
    });

    // 11. Efecto Específico: HX-10 (Red Flash / Alarm)
    const hx10Elements = document.querySelectorAll('.hx-10');

    hx10Elements.forEach(el => {
      const chars = el.querySelectorAll('.char');
      const defaults = { duration: 0.2, ease: 'power2.in' };

      const animateChars = () => {
        // En este efecto iteramos sobre cada char individualmente para crear timelines independientes
        chars.forEach(char => {
          gsap.timeline({ defaults: defaults })
            .fromTo(char,
              {
                willChange: 'filter',
                filter: 'brightness(100%) drop-shadow(0px 0px 0px #ff0000)'
              },
              {
                delay: gsap.utils.random(0, 1),
                repeat: 3,
                yoyo: true,
                filter: 'brightness(300%) drop-shadow(0px 0px 20px #ff0000)'
              }
            );
        });
      };

      const resetChars = () => {
        gsap.killTweensOf(chars);
        gsap.set(chars, {
          filter: 'brightness(100%) drop-shadow(0px 0px 0px transparent)'
        });
      };

      // Estado inicial
      gsap.set(chars, { filter: 'brightness(100%) drop-shadow(0px 0px 0px transparent)' });


      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        onEnter: () => animateChars(),
        onEnterBack: () => animateChars(),
        onLeave: () => resetChars(),
        onLeaveBack: () => resetChars()
      });
    });

    // 12. Efecto Específico: HX-11 (Flip / Zoom)
    const hx11Element = document.querySelector('.hx-11') as HTMLElement;
    if (hx11Element) {
      gsap.registerPlugin(Flip);

      const container = hx11Element.closest('.hx-flip-container') as HTMLElement;
      const flipElement = container.querySelector('.hx-flip__inner') as HTMLElement;
      const flipWrapper = container.querySelector('.hx-flip') as HTMLElement;
      const paragraphBlock = container.querySelector('.content__text') as HTMLElement;

      if (flipElement && flipWrapper) {
        // Lógica basada en Codrops:
        // 1. Ponemos el elemento en su estado FINAL (dentro del texto del párrafo) para capturar medidas
        gsap.set(flipElement, { filter: 'blur(0px)' });
        hx11Element.appendChild(flipElement);

        // 2. Capturamos el estado (Flip State)
        const state = Flip.getState(flipElement, { props: 'font-size, filter, color' });

        // 3. Devolvemos el elemento a su estado INICIAL (Título grande fuera del párrafo)
        flipWrapper.appendChild(flipElement);
        gsap.set(flipElement, { filter: 'blur(5px)' }); // Efecto de blur inicial

        // 4. Animamos de Inicio a Final con ScrollTrigger
        Flip.to(state, {
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: container,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: true
          }
        })
          // Animación adicional para el párrafo (efecto de enfoque cuando entra la palabra)
          .fromTo(paragraphBlock,
            {
              filter: 'blur(2px)',
              scale: 0.95,
              opacity: 0.8
            },
            {
              filter: 'blur(0px)',
              scale: 1,
              opacity: 1,
              ease: 'sine.inOut',
              scrollTrigger: {
                trigger: container,
                start: 'top 60%',
                end: 'bottom 80%',
                scrub: true
              }
            },
            0 // Sincronizado
          );
      }
    }

    // 13. Efecto Específico: HX-12 (Word Trail / Slot Machine)
    const hx12Elements = document.querySelectorAll('.hx-12');
    hx12Elements.forEach(el => {
      // 1. Split en palabras
      const split = new SplitType(el as HTMLElement, { types: 'words' });
      const originalWords = split.words || [];

      // 2. Iterar sobre cada palabra para envolverla y clonarla
      originalWords.forEach(word => {
        // Envolver palabra en un div contenedor para posicionamiento relativo
        const wrapper = document.createElement('div');
        wrapper.classList.add('hx-12-wrapper');
        if (word.parentNode) {
          word.parentNode.insertBefore(wrapper, word);
          wrapper.appendChild(word);
        }

        // Clonar la palabra 8 veces
        const clones: HTMLElement[] = [];
        for (let i = 0; i < 8; i++) {
          const clone = word.cloneNode(true) as HTMLElement;
          clone.setAttribute('aria-hidden', 'true');
          wrapper.appendChild(clone);
          clones.push(clone);
        }

        const defaults = { duration: 1.2, ease: 'expo' };

        // Animación
        const animateTrail = () => {
          const tl = gsap.timeline({ defaults: defaults });

          // Animar clones desde abajo
          tl.fromTo(clones,
            { yPercent: 150, opacity: 0 },
            { stagger: 0.1, yPercent: 0, opacity: 1 }
          )
            // Desvanecer clones rápidamente
            .to(clones,
              { stagger: 0.1, opacity: 0, duration: 0.01 },
              defaults.duration
            )
            // Cambiar color de la palabra original
            .to(word,
              {
                color: getComputedStyle(el).getPropertyValue('--color-highlight-end') || '#e0ac2b'
              },
              defaults.duration + 0.1 * clones.length - 1
            );
        };

        const resetTrail = () => {
          gsap.killTweensOf([clones, word]);
          gsap.set(clones, { opacity: 0 }); // Ocultos
          gsap.set(word, { color: '' });
        };

        // Estado inicial
        gsap.set(clones, { opacity: 0 });

        ScrollTrigger.create({
          trigger: el, // Disparador es la frase completa
          start: 'top 80%',
          onEnter: () => animateTrail(),
          onEnterBack: () => animateTrail(),
          onLeave: () => resetTrail(),
          onLeaveBack: () => resetTrail()
        });
      });
    });

    // 14. Efecto Específico: HX-13 (Glow & Select Marker)
    const hx13Elements = document.querySelectorAll('.hx-13');
    hx13Elements.forEach(el => {
      const selectMarker = el.querySelector('.hx__select') as HTMLElement;
      const chars = el.querySelectorAll('.char');

      if (!selectMarker) return;

      const defaults = { duration: 0.4, ease: 'power1.inOut' };

      const animateChars = () => {
        gsap
          .timeline({ defaults: defaults })
          .fromTo(chars,
            {
              willChange: 'filter',
              filter: 'drop-shadow(0px 0px 0px #ffdbf5)'
            },
            {
              stagger: 0.03,
              filter: 'drop-shadow(0px 0px 20px #ffdbf5)'
            }
          )
          .to(selectMarker,
            {
              duration: 0.8,
              ease: 'expo',
              '--select-width': getComputedStyle(el).getPropertyValue('--select-width-final') || '103%'
            },
            0
          );
      };

      const resetChars = () => {
        gsap.killTweensOf([chars, selectMarker]);
        gsap.set(selectMarker, { '--select-width': '0%' });
        gsap.set(chars, { filter: 'drop-shadow(0px 0px 0px #ffdbf5)' });
      };

      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        onEnter: () => animateChars(),
        onEnterBack: () => animateChars(),
        onLeave: () => resetChars(),
        onLeaveBack: () => resetChars()
      });
    });


  }



}


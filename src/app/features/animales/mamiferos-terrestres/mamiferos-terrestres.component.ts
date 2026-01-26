
import { ChangeDetectionStrategy, Component, signal, computed, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Slide {
  title: string;
  scientificName: string;
  description: string;
  weight: string;
  image: string;
  link?: string;
}

@Component({
  selector: 'app-mamiferos-terrestres',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mamiferos-terrestres.component.html',
  styleUrls: ['./mamiferos-terrestres.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MamiferosTerrestresComponent implements AfterViewInit {
  // Slide data
  readonly slides: Slide[] = [
    {
      title: 'Jaguar',
      scientificName: 'Panthera onca',
      description: 'El depredador supremo del Amazonas, el jaguar es el felino más grande de América y el tercero del mundo. Con su distintivo pelaje dorado decorado con rosetas negras, este cazador nocturno domina su territorio con mordidas poderosas capaces de perforar cráneos y caparazones. Excelente nadador, caza tanto en tierra como en agua, siendo fundamental para el equilibrio del ecosistema amazónico.',
      weight: '96 kg',
      image: 'assets/mammals/jaguar.png',
      link: 'https://es.wikipedia.org/wiki/Panthera_onca'
    },
    {
      title: 'Tapir Brasileño',
      scientificName: 'Tapirus terrestris',
      description: 'El jardinero del bosque, el tapir brasileño es uno de los mamíferos herbívoros más grandes de Sudamérica. Con su distintiva trompa flexible y cuerpo robusto, este pariente lejano de los rinocerontes y caballos dispersa semillas a través del bosque, siendo crucial para la regeneración forestal. Animal tímido y principalmente nocturno, prefiere áreas cercanas al agua donde puede sumergirse para escapar de depredadores.',
      weight: '250 kg',
      image: 'assets/mammals/tapir.png',
      link: 'https://es.wikipedia.org/wiki/Tapirus_terrestris'
    },
    {
      title: 'Pecarí Labiado',
      scientificName: 'Tayassu pecari',
      description: 'El arquitecto social de la selva, el pecarí labiado vive en manadas de hasta 300 individuos que se desplazan ruidosamente por el bosque. Reconocible por su característico labio blanco, este omnívoro juega un rol esencial en la dispersión de semillas y el control de invertebrados. Sus grandes grupos pueden modificar significativamente el sotobosque, creando claros que benefician a otras especies.',
      weight: '40 kg',
      image: 'assets/mammals/peccary.png',
      link: 'https://es.wikipedia.org/wiki/Tayassu_pecari'
    }
  ];

  // Current slide index
  readonly current = signal<number>(0);

  // Animation state
  readonly isAnimating = signal<boolean>(false);

  // Computed properties for navigation images
  readonly prevImage = computed(() => {
    const prevIndex = this.current() > 0
      ? this.current() - 1
      : this.slides.length - 1;
    return this.slides[prevIndex].image;
  });

  readonly nextImage = computed(() => {
    const nextIndex = this.current() < this.slides.length - 1
      ? this.current() + 1
      : 0;
    return this.slides[nextIndex].image;
  });

  // Current slide computed property
  readonly currentSlide = computed(() => this.slides[this.current()]);

  ngAfterViewInit(): void {
    // Initial setup is handled by template bindings
  }

  navigatePrev(): void {
    if (this.isAnimating()) return;

    this.isAnimating.set(true);
    const newIndex = this.current() > 0
      ? this.current() - 1
      : this.slides.length - 1;

    // Update index
    this.current.set(newIndex);

    // Reset animation flag after transition
    setTimeout(() => {
      this.isAnimating.set(false);
    }, 450);
  }

  navigateNext(): void {
    if (this.isAnimating()) return;

    this.isAnimating.set(true);
    const newIndex = this.current() < this.slides.length - 1
      ? this.current() + 1
      : 0;

    // Update index
    this.current.set(newIndex);

    // Reset animation flag after transition
    setTimeout(() => {
      this.isAnimating.set(false);
    }, 450);
  }

  getSlidePosition(index: number, direction: 'item' | 'slide'): string {
    const curr = this.current();

    if (index === curr) {
      return '0';
    }

    // For items (content): next slide comes from top (-100%), prev from bottom (100%)
    // For slides (images): next slide comes from bottom (100%), prev from top (-100%)
    // This creates the opposite direction effect

    if (direction === 'item') {
      // Content movement
      if (index === (curr + 1) % this.slides.length) {
        return '-100%'; // Next item is above
      } else if (index === (curr - 1 + this.slides.length) % this.slides.length) {
        return '100%'; // Previous item is below
      }
    } else {
      // Image movement (opposite)
      if (index === (curr + 1) % this.slides.length) {
        return '100%'; // Next slide is below
      } else if (index === (curr - 1 + this.slides.length) % this.slides.length) {
        return '-100%'; // Previous slide is above
      }
    }

    // Hidden slides far away
    return index > curr ? '200%' : '-200%';
  }

  getZIndex(index: number): number {
    return index === this.current() ? 999 : 1;
  }
}

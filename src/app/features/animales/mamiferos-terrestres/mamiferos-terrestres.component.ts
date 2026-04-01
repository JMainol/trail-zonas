import { ChangeDetectionStrategy, Component, signal, computed, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; import { TranslateModule } from '@ngx-translate/core';


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
  imports: [CommonModule, RouterModule, TranslateModule],


  templateUrl: './mamiferos-terrestres.component.html',
  styleUrls: ['./mamiferos-terrestres.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MamiferosTerrestresComponent implements AfterViewInit {
  // Slide data
  readonly slides: Slide[] = [
    {
      title: 'MAMMALS.JAGUAR.TITLE',
      scientificName: 'Panthera onca',
      description: 'MAMMALS.SLIDER.JAGUAR.DESCRIPTION',
      weight: 'MAMMALS.SLIDER.JAGUAR.WEIGHT',
      image: 'assets/mammals/jaguar.png',
      link: 'jaguar'
    },
    {
      title: 'MAMMALS.TAPIR.TITLE',
      scientificName: 'Tapirus terrestris',
      description: 'MAMMALS.SLIDER.TAPIR.DESCRIPTION',
      weight: 'MAMMALS.SLIDER.TAPIR.WEIGHT',
      image: 'assets/mammals/tapir/tapir.png',
      link: 'tapir'
    },
    {
      title: 'MAMMALS.PECARI.TITLE',
      scientificName: 'Tayassu pecari',
      description: 'MAMMALS.SLIDER.PECARI.DESCRIPTION',
      weight: 'MAMMALS.SLIDER.PECARI.WEIGHT',
      image: 'assets/mammals/peccary.png',
      link: 'pecari'
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

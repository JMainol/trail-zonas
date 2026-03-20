import { ChangeDetectionStrategy, Component, signal, computed, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';


interface Slide {
    title: string;
    scientificName: string;
    description: string;
    weight: string; // Used for "Usage/Feature" in this context
    image: string;
    link?: string;
}

@Component({
    selector: 'app-medicinales',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule],


    templateUrl: './medicinales.component.html',
    styleUrls: ['./medicinales.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MedicinalesComponent implements AfterViewInit {
    // Slide data
    readonly slides: Slide[] = [
        {
            title: 'PLANTS.MEDICINAL.SLIDES.UNA_DE_GATO.TITLE',
            scientificName: 'Uncaria tomentosa',
            description: 'PLANTS.MEDICINAL.SLIDES.UNA_DE_GATO.DESCRIPTION',
            weight: 'PLANTS.MEDICINAL.SLIDES.UNA_DE_GATO.USAGE',
            image: 'assets/plants/una-de-gato.png',
            link: 'una-de-gato'
        },
        {
            title: 'PLANTS.MEDICINAL.SLIDES.SANGRE_DE_GRADO.TITLE',
            scientificName: 'Croton lechleri',
            description: 'PLANTS.MEDICINAL.SLIDES.SANGRE_DE_GRADO.DESCRIPTION',
            weight: 'PLANTS.MEDICINAL.SLIDES.SANGRE_DE_GRADO.USAGE',
            image: 'assets/plants/sangre-de-grado.png',
            link: 'sangre-de-grado'
        },
        {
            title: 'PLANTS.MEDICINAL.SLIDES.AYAHUASCA.TITLE',
            scientificName: 'Banisteriopsis caapi',
            description: 'PLANTS.MEDICINAL.SLIDES.AYAHUASCA.DESCRIPTION',
            weight: 'PLANTS.MEDICINAL.SLIDES.AYAHUASCA.USAGE',
            image: 'assets/plants/ayahuasca.png',
            link: 'ayahuasca'
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

import { ChangeDetectionStrategy, Component, signal, computed, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    imports: [CommonModule],
    templateUrl: './medicinales.component.html',
    styleUrls: ['./medicinales.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MedicinalesComponent implements AfterViewInit {
    // Slide data
    readonly slides: Slide[] = [
        {
            title: 'Uña de Gato',
            scientificName: 'Uncaria tomentosa',
            description: 'La uña de gato es una liana amazónica que escala hacia el sol mediante espinas en forma de garra. Reconocida por sus alcaloides oxindólicos, actúa como un potente inmunomodulador y antiinflamatorio natural de amplio espectro. Es, en esencia, un escudo biológico que transmuta la vitalidad de la selva en medicina, protegiendo la integridad del organismo con la tenacidad de un guardián ancestral.',
            weight: 'Inmune',
            image: 'assets/plants/una-de-gato.png',
            link: 'https://es.wikipedia.org/wiki/Uncaria_tomentosa'
        },
        {
            title: 'Sangre de Grado',
            scientificName: 'Croton lechleri',
            description: 'La sangre de grado es un árbol amazónico que, al ser herido, exhala un denso látex rojizo de asombrosa capacidad regenerativa. Rica en taspina y proantocianidinas, esta resina actúa como un potente cicatrizante y antiséptico natural, sellando tejidos con una barrera protectora instantánea. Es, en esencia, una lágrima escarlata de la selva que transmuta el dolor del árbol en medicina, restaurando la piel.',
            weight: 'Cura',
            image: 'assets/plants/sangre-de-grado.png',
            link: 'https://es.wikipedia.org/wiki/Croton_lechleri'
        },
        {
            title: 'Ayahuasca',
            scientificName: 'Banisteriopsis caapi',
            description: 'La ayahuasca es la "liana del alma", planta maestra y eje ritual para la limpieza espiritual y la conexión con el espíritu de la selva. Rica en beta-carbolinas, su farmacología permite una profunda purga y expansión de la conciencia. Es un puente visionario que funde el ser con el pulso de la selva, descorriendo el velo de lo invisible con sabiduría milenaria.',
            weight: 'Ritual',
            image: 'assets/plants/ayahuasca.png',
            link: 'https://es.wikipedia.org/wiki/Banisteriopsis_caapi'
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

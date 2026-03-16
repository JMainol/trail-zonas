import { ChangeDetectionStrategy, Component, signal, computed, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


interface Slide {
    title: string;
    scientificName: string;
    description: string;
    weight: string; // Used for "Usage/Feature" in this context
    image: string;
    link?: string;
    disabled?: boolean;
}

@Component({
    selector: 'app-etnias',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './etnias.component.html',
    styleUrls: ['./etnias.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EtniasComponent implements AfterViewInit {
    // Slide data
    readonly slides: Slide[] = [
        {
            title: 'Waorani',
            scientificName: 'Tribu Waorani',
            description: 'En el corazón indómito del Yasuní, los Waorani se erigen como uno de los últimos bastiones de resistencia cultural. Conocidos por su linaje de maestros cazadores y su lengua única, el Wao Terero, luchan por preservar su equilibrio con la tierra frente a las presiones externas, protegiendo la libertad de sus parientes en aislamiento voluntario.',
            weight: 'Yasuní',
            image: 'assets/images/tribes/waorani/waorani_hombre_mayor_hombre_joven.jpg',
            link: 'waorani'
        },
        {
            title: 'Shuar',
            scientificName: 'Pueblo de las Cascadas Sagradas',
            description: 'Los Shuar son conocidos históricamente por ser uno de los pocos pueblos que ni el Imperio Inca ni los conquistadores lograron someter, liderando una de las rebeliones más exitosas contra la corona española. Su místico ritual de las cabezas reducidas o "Tzantza" no era un simple trofeo, sino una ceremonia para capturar el espíritu del enemigo y restablecer el equilibrio espiritual.',
            weight: 'Amazonía',
            image: 'assets/images/tribes/shuar/shuar_dos_hombre_una_mujer.png',
            link: 'shuar',
            disabled: true
        },
        {
            title: 'Cofán',
            scientificName: 'Hombres Jaguar',
            description: 'Los Cofán son un pueblo ancestral del norte de la Amazonía ecuatoriana, conocidos como los "hombres jaguar" y hablantes del A\'ingae, una lengua única en el mundo. Su cultura se centra en la conexión espiritual con la selva a través del Yagé y en una histórica defensa de su territorio frente a la explotación petrolera. Como guardianes de la biodiversidad, han logrado victorias legales clave para proteger sus tierras sagradas, manteniendo un equilibrio vital entre sus tradiciones milenarias y la resistencia moderna.',
            weight: 'Norte Amazonía',
            image: 'assets/images/tribes/cofan/hombre_tribu_cofan.png',
            link: 'cofan',
            disabled: true
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

        if (direction === 'item') {
            if (index === (curr + 1) % this.slides.length) {
                return '-100%';
            } else if (index === (curr - 1 + this.slides.length) % this.slides.length) {
                return '100%';
            }
        } else {
            if (index === (curr + 1) % this.slides.length) {
                return '100%';
            } else if (index === (curr - 1 + this.slides.length) % this.slides.length) {
                return '-100%';
            }
        }

        return index > curr ? '200%' : '-200%';
    }

    getZIndex(index: number): number {
        return index === this.current() ? 999 : 1;
    }
}

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
    disabled?: boolean;
}

@Component({
    selector: 'app-etnias',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule],
    templateUrl: './etnias.component.html',
    styleUrls: ['./etnias.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EtniasComponent implements AfterViewInit {
    // Slide data
    readonly slides: Slide[] = [
        {
            title: 'TRIBES.WAORANI.TITLE',
            scientificName: 'TRIBES.WAORANI.SUBTITLE',
            description: 'TRIBES.WAORANI.DESCRIPTION',
            weight: 'TRIBES.WAORANI.REGION',
            image: 'assets/images/tribes/waorani/waorani_hombre_mayor_hombre_joven.jpg',
            link: 'waorani'
        },
        {
            title: 'TRIBES.SHUAR.TITLE',
            scientificName: 'TRIBES.SHUAR.SUBTITLE',
            description: 'TRIBES.SHUAR.DESCRIPTION',
            weight: 'TRIBES.SHUAR.REGION',
            image: 'assets/images/tribes/shuar/shuar_dos_hombre_una_mujer.png',
            link: 'shuar',
            disabled: true
        },
        {
            title: 'TRIBES.COFAN.TITLE',
            scientificName: 'TRIBES.COFAN.SUBTITLE',
            description: 'TRIBES.COFAN.DESCRIPTION',
            weight: 'TRIBES.COFAN.REGION',
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

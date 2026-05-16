import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MediaCaptionComponent } from '../../../../shared/components/media-caption/media-caption.component';

@Component({
    selector: 'app-mehinaku',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule, MatIconModule, MediaCaptionComponent],
    templateUrl: './mehinaku.component.html',
    styleUrl: './mehinaku.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MehinakuComponent {
    private location = inject(Location);

    // Signal for parallax
    protected parallaxTransform = signal('');

    // Tab control
    protected activeTab = signal('photos');
    protected isExpanded = signal(false);

    // Gallery Slider
    protected galleryImages = [
        'assets/images/tribes/mehinaku/mehinaku_mujer.jpg',
        'assets/images/tribes/mehinaku/mehinaku_hombre.jpg',
        'assets/images/tribes/mehinaku/mehinaku_anciana.jpg'
    ];
    protected currentPhotoIndex = signal(0);

    toggleExpanded() {
        this.isExpanded.set(!this.isExpanded());
    }

    nextPhoto() {
        this.currentPhotoIndex.update(i => (i + 1) % this.galleryImages.length);
    }

    prevPhoto() {
        this.currentPhotoIndex.update(i => (i - 1 + this.galleryImages.length) % this.galleryImages.length);
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        const x = (event.clientX - window.innerWidth / 2) * -0.02;
        const y = (event.clientY - window.innerHeight / 2) * -0.02;
        this.parallaxTransform.set(`translate(${x}px, ${y}px)`);
    }

    setTab(tab: string) {
        this.activeTab.set(tab);
    }

    goBack() {
        this.location.back();
    }
}

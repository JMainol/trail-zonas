import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MediaCaptionComponent } from '../../../../shared/components/media-caption/media-caption.component';

@Component({
    selector: 'app-kayapo',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule, MatIconModule, MediaCaptionComponent],
    templateUrl: './kayapo.component.html',
    styleUrl: './kayapo.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KayapoComponent {
    private location = inject(Location);

    // Signal for parallax
    protected parallaxTransform = signal('');

    // Tab control
    protected activeTab = signal('photos');
    protected isExpanded = signal(false);

    // Gallery Slider
    protected galleryImages = [
        'assets/images/tribes/kayapo/kayapo_tribe.jpg',
        'assets/images/tribes/kayapo/kayapo_tribe_child2.jpg',
        'assets/images/tribes/kayapo/kayapo_tribe_child3.jpg',
        'assets/images/tribes/kayapo/kayapo_tribe_earrings.jpg',
        'assets/images/tribes/kayapo/kayapo_tribe_mother_and_her_daugther.jpg',
        'assets/images/tribes/kayapo/kayapo_tribe_young_man.jpg'
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

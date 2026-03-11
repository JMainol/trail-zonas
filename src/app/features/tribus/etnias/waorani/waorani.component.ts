import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-waorani',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule, MatIconModule],
    templateUrl: './waorani.component.html',
    styleUrl: './waorani.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaoraniComponent {
    private sanitizer = inject(DomSanitizer);
    private location = inject(Location);

    // Video URL
    protected videoUrl = signal<SafeResourceUrl>(
        this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/xen2Drp47iI?si=W-n-v8EpB5am6VZ0')
    );

    // Signal for parallax
    protected parallaxTransform = signal('');

    // Tab control
    protected activeTab = signal('video'); // 'video', 'info', 'photos'
    protected isExpanded = signal(false);

    // Gallery Slider
    protected galleryImages = [
        'assets/images/tribes/waorani/waorani_hombre_mayor_hombre_joven.jpg',
        'assets/images/tribes/waorani/miembros_tribu_waorani.jpg',
        'assets/images/tribes/waorani/hombre_waorani_cerbatana.png',
        'assets/images/tribes/waorani/hombre_waorani_con_mono.png'
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

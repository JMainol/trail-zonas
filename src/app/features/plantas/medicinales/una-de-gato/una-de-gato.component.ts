
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MediaCaptionComponent } from '../../../../shared/components/media-caption/media-caption.component';


import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-una-de-gato',
    standalone: true,
    imports: [CommonModule, RouterModule, MediaCaptionComponent, TranslateModule, MatIconModule],

    templateUrl: './una-de-gato.component.html',
    styleUrl: './una-de-gato.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnaDeGatoComponent {
    private sanitizer = inject(DomSanitizer);
    private location = inject(Location);

    // Video URL
    protected videoUrl = signal<SafeResourceUrl>(
        this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/Xi6jR1uafKE')
    );

    // Signal for parallax
    protected parallaxTransform = signal('');

    // UI State Signals
    protected activeTab = signal('video'); // 'video', 'properties'
    protected isExpanded = signal(false);

    toggleExpanded() {
        this.isExpanded.set(!this.isExpanded());
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

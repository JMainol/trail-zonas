
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MediaCaptionComponent } from '../../../../shared/components/media-caption/media-caption.component';


import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-sangre-de-grado',
    standalone: true,
    imports: [CommonModule, RouterModule, MediaCaptionComponent, TranslateModule, MatIconModule],

    templateUrl: './sangre-de-grado.component.html',
    styleUrl: './sangre-de-grado.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SangreDeGradoComponent {
    private sanitizer = inject(DomSanitizer);
    private location = inject(Location);

    // Video URL
    protected videoUrl = signal<SafeResourceUrl>(
        this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/r78SYE7aJEw')
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

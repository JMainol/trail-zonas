import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
    selector: 'app-cotinga',
    standalone: true,
    imports: [CommonModule, YouTubePlayer],
    templateUrl: './cotinga.component.html',
    styleUrl: './cotinga.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CotingaComponent implements OnInit {
    private sanitizer = inject(DomSanitizer);
    private platformId = inject(PLATFORM_ID);
    protected isBrowser = signal(false);

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.isBrowser.set(true);
            if (!(window as any).YT) {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                document.body.appendChild(tag);
            }
        }
    }

    // Signal for parallax
    protected parallaxTransform = signal('');

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (!isPlatformBrowser(this.platformId)) return;
        const x = (event.clientX - window.innerWidth / 2) * -0.02;
        const y = (event.clientY - window.innerHeight / 2) * -0.02;
        this.parallaxTransform.set(`translate(${x}px, ${y}px)`);
    }
}

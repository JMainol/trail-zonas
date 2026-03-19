import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YouTubePlayer } from '@angular/youtube-player';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MediaCaptionComponent } from '../../../../shared/components/media-caption/media-caption.component';

@Component({
    selector: 'app-cotinga',
    standalone: true,
    imports: [CommonModule, YouTubePlayer, TranslateModule, MediaCaptionComponent, MatIconModule],
    templateUrl: './cotinga.component.html',
    styleUrl: './cotinga.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CotingaComponent implements OnInit {
    private sanitizer = inject(DomSanitizer);
    private platformId = inject(PLATFORM_ID);
    private router = inject(Router);
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

    @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

    // Video URL
    protected videoUrl = signal<SafeResourceUrl>(
        this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/VtsSfaFIKuI')
    );

    // Signal for parallax
    protected parallaxTransform = signal('');

    protected isExpanded = signal(false);

    // Signals for tabs and audio player
    protected isPlaying = signal(false);
    protected currentTime = signal(0);
    protected duration = signal(0);
    protected progress = signal(0);
    protected activeTab = signal('video'); // 'video', 'sound', 'map'

    setTab(tab: string) {
        this.activeTab.set(tab);
    }

    togglePlay() {
        const audio = this.audioPlayer.nativeElement;
        if (this.isPlaying()) {
            audio.pause();
        } else {
            audio.play();
        }
        this.isPlaying.set(!this.isPlaying());
    }

    onTimeUpdate() {
        const audio = this.audioPlayer.nativeElement;
        this.currentTime.set(audio.currentTime);
        this.progress.set((audio.currentTime / audio.duration) * 100);
    }

    onLoadedMetadata() {
        const audio = this.audioPlayer.nativeElement;
        this.duration.set(audio.duration);
    }

    onAudioEnded() {
        this.isPlaying.set(false);
        this.currentTime.set(0);
        this.progress.set(0);
    }

    seek(event: MouseEvent) {
        const audio = this.audioPlayer.nativeElement;
        const bar = (event.currentTarget as HTMLElement);
        const rect = bar.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const width = rect.width;
        const percent = x / width;
        audio.currentTime = percent * audio.duration;
    }

    formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    goBack() {
        this.router.navigate(['/amazonia/animales/aves']);
    }

    toggleExpanded() {
        this.isExpanded.set(!this.isExpanded());
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (!isPlatformBrowser(this.platformId)) return;
        const x = (event.clientX - window.innerWidth / 2) * -0.02;
        const y = (event.clientY - window.innerHeight / 2) * -0.02;
        this.parallaxTransform.set(`translate(${x}px, ${y}px)`);
    }
}

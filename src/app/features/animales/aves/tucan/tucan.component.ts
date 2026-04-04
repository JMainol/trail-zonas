import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild, inject, signal, computed, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YouTubePlayer } from '@angular/youtube-player';
import { TranslateModule } from '@ngx-translate/core';
import { MediaCaptionComponent } from '../../../../shared/components/media-caption/media-caption.component';


import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-tucan',
  standalone: true,
  imports: [CommonModule, YouTubePlayer, TranslateModule, MediaCaptionComponent, MatIconModule, NgOptimizedImage],
  templateUrl: './tucan.component.html',
  styleUrl: './tucan.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TucanComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  protected isBrowser = signal(false);
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

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

  // Video URL
  protected videoUrl = signal<SafeResourceUrl>(
    this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/XLOw4zHWIXM')
  );

  // Signal for parallax
  protected parallaxTransform = signal('');

  // Signals for custom audio player
  protected isPlaying = signal(false);
  protected currentTime = signal(0);
  protected duration = signal(0);
  protected progress = computed(() => {
    const d = this.duration();
    return d > 0 ? (this.currentTime() / d) * 100 : 0;
  });
  protected activeTab = signal('video'); // 'video', 'sound', 'map', 'subspecies'

  // Gallery Slider
  protected galleryImages = [
    {
      url: 'assets/images/birds/tucan/arasari_acollarado.png.png',
      nameKey: 'BIRDS.SUBSPECIES_1_NAME',
      sciKey: 'BIRDS.SUBSPECIES_1_SCI'
    },
    {
      url: 'assets/images/birds/tucan/tucan_bicolor.png.png',
      nameKey: 'BIRDS.SUBSPECIES_2_NAME',
      sciKey: 'BIRDS.SUBSPECIES_2_SCI'
    }
  ];
  protected currentPhotoIndex = signal(0);

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!isPlatformBrowser(this.platformId)) return;
    const x = (event.clientX - window.innerWidth / 2) * -0.02;
    const y = (event.clientY - window.innerHeight / 2) * -0.02;
    this.parallaxTransform.set(`translate(${x}px, ${y}px)`);
  }

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
  }

  onLoadedMetadata() {
    const audio = this.audioPlayer.nativeElement;
    this.duration.set(audio.duration);
  }

  onAudioEnded() {
    this.isPlaying.set(false);
    this.currentTime.set(0);
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

  nextPhoto() {
    this.currentPhotoIndex.update(i => (i + 1) % this.galleryImages.length);
  }

  prevPhoto() {
    this.currentPhotoIndex.update(i => (i - 1 + this.galleryImages.length) % this.galleryImages.length);
  }

  goBack() {
    this.router.navigate(['/amazonia/animales/aves']);
  }
}

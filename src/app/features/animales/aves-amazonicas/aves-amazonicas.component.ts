
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aves-amazonicas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aves-amazonicas.component.html',
  styleUrl: './aves-amazonicas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvesAmazonicasComponent {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  // Signal for parallax
  protected parallaxTransform = signal('');

  // Signals for custom audio player
  protected isPlaying = signal(false);
  protected currentTime = signal(0);
  protected duration = signal(0);
  protected progress = signal(0);

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const x = (event.clientX - window.innerWidth / 2) * -0.02;
    const y = (event.clientY - window.innerHeight / 2) * -0.02;
    this.parallaxTransform.set(`translate(${x}px, ${y}px)`);
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
}

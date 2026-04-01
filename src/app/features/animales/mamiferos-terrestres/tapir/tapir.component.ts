
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';


import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-tapir',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule, MatIconModule],

    templateUrl: './tapir.component.html',
    styleUrl: './tapir.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TapirComponent {
    private sanitizer = inject(DomSanitizer);
    private location = inject(Location);
    @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

    // Video URL
    protected videoUrl = signal<SafeResourceUrl>(
        this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/PF4LuV2KIG0')
    );

    // Signal for parallax
    protected parallaxTransform = signal('');

    // Signals for custom audio player
    protected isPlaying = signal(false);
    protected currentTime = signal(0);
    protected duration = signal(0);
    protected progress = signal(0);
    protected activeTab = signal('video'); // 'video', 'sound', 'map', 'subspecies'
    protected isExpanded = signal(false);

    // Gallery Slider
    protected galleryImages = [
        {
            url: 'assets/mammals/tapir/malayan-tapir.jpg',
            nameKey: 'MAMMALS.TAPIR.SUBSPECIES_1_NAME',
            sciKey: 'MAMMALS.TAPIR.SUBSPECIES_1_SCI'
        },
        {
            url: 'assets/mammals/tapir/malayan-tapir-baby.jpg',
            nameKey: 'MAMMALS.TAPIR.SUBSPECIES_2_NAME',
            sciKey: 'MAMMALS.TAPIR.SUBSPECIES_2_SCI'
        },
        {
            url: 'assets/mammals/tapir/malayan-tapir-with-baby.png',
            nameKey: 'MAMMALS.TAPIR.SUBSPECIES_3_NAME',
            sciKey: 'MAMMALS.TAPIR.SUBSPECIES_3_SCI'
        }
    ];
    protected currentPhotoIndex = signal(0);

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

    nextPhoto() {
        this.currentPhotoIndex.update(i => (i + 1) % this.galleryImages.length);
    }

    prevPhoto() {
        this.currentPhotoIndex.update(i => (i - 1 + this.galleryImages.length) % this.galleryImages.length);
    }

    goBack() {
        this.location.back();
    }
}

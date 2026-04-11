import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export type MediaIconType = 'web' | 'instagram' | 'youtube' | 'ai';

@Component({
  selector: 'app-media-caption',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './media-caption.component.html',
  styleUrl: './media-caption.component.scss'
})
export class MediaCaptionComponent {
  title = input<string>('');
  author = input<string>('');
  authorUrl = input<string>('');
  iconType = input<MediaIconType>('web');

  onNavigate() {
    const url = this.authorUrl();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}

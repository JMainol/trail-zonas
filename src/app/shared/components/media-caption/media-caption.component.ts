import { Component, Input } from '@angular/core';
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
  @Input() title: string = '';
  @Input() author: string = '';
  @Input() authorUrl: string = '';
  @Input() iconType: MediaIconType = 'web';

  onNavigate() {
    if (this.authorUrl) {
      window.open(this.authorUrl, '_blank', 'noopener,noreferrer');
    }
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { ResourcePageBase } from '../shared/resource-page.base';
import { ResourceRelatedComponent } from '../shared/resource-related.component';

/** Documental «Yanuni» (Richard Ladkani, 2025), producido por Leonardo DiCaprio. */
@Component({
  selector: 'app-yanuni',
  standalone: true,
  imports: [RouterLink, MatIconModule, TranslateModule, YouTubePlayer, ResourceRelatedComponent],
  templateUrl: './yanuni.component.html',
  styleUrl: '../shared/resource-article.scss',
  host: { style: '--accent:#f59e0b;--accent-soft:rgba(245,158,11,.12);--accent-line:rgba(245,158,11,.3)' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YanuniComponent extends ResourcePageBase {
  /** Tráiler oficial en YouTube. */
  readonly trailerId = 'LRMXjbDMeWY';
  /** Parámetros del reproductor: sin vídeos relacionados de otros canales y con subtítulos disponibles. */
  readonly playerVars = { rel: 0, modestbranding: 1, playsinline: 1, cc_load_policy: 0 };
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ResourcePageBase } from '../shared/resource-page.base';
import { ResourceRelatedComponent } from '../shared/resource-related.component';

/** Ash Dykes, explorador galés, y su expedición «Uncharted Amazon» por el río Coppename (Surinam). */
@Component({
  selector: 'app-ash-dykes',
  standalone: true,
  imports: [RouterLink, MatIconModule, TranslateModule, ResourceRelatedComponent],
  templateUrl: './ash-dykes.component.html',
  styleUrl: '../shared/resource-article.scss',
  host: { style: '--accent:#38bdf8;--accent-soft:rgba(56,189,248,.12);--accent-line:rgba(56,189,248,.3)' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AshDykesComponent extends ResourcePageBase {}

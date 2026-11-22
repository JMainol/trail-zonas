import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ResourcePageBase } from '../shared/resource-page.base';
import { ResourceRelatedComponent } from '../shared/resource-related.component';

/** VozTerra: colectivo colombiano de paisajes sonoros y escucha consciente de la naturaleza. */
@Component({
  selector: 'app-vozterra',
  standalone: true,
  imports: [RouterLink, MatIconModule, TranslateModule, ResourceRelatedComponent],
  templateUrl: './vozterra.component.html',
  styleUrls: ['../shared/resource-article.scss', './vozterra.component.scss'],
  host: { style: '--accent:#a78bfa;--accent-soft:rgba(167,139,250,.12);--accent-line:rgba(167,139,250,.3)' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VozterraComponent extends ResourcePageBase {
  /** Alturas relativas de las barras del ecualizador decorativo. */
  readonly bars = [18, 34, 52, 28, 64, 80, 46, 72, 38, 90, 58, 30, 68, 44, 84, 54, 26, 62, 40, 76, 50, 22, 58, 36, 70, 42, 20, 48];
}

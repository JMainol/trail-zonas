import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { RESOURCES_CATALOG } from '../shared/resources.catalog';

/** Portada de la sección Recursos: documentales, investigación y próximos contenidos. */
@Component({
  selector: 'app-recursos-hub',
  standalone: true,
  imports: [RouterLink, MatIconModule, TranslateModule],
  templateUrl: './recursos-hub.component.html',
  styleUrls: ['../shared/resource-article.scss', './recursos-hub.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecursosHubComponent {
  readonly documentaries = RESOURCES_CATALOG.filter((r) => r.categoryKey === 'COMMON.DOCUMENTARIES');
  readonly research = RESOURCES_CATALOG.filter((r) => r.categoryKey === 'COMMON.RESEARCH');
  readonly upcoming = [
    { labelKey: 'COMMON.BOOKS', icon: 'menu_book' },
    { labelKey: 'COMMON.MOVIES', icon: 'theaters' },
  ];
}

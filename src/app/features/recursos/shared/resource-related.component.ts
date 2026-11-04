import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { RESOURCES_CATALOG } from './resources.catalog';

/** Bloque «Sigue explorando»: enlaza al resto de recursos publicados y a la portada de la sección. */
@Component({
  selector: 'app-resource-related',
  standalone: true,
  imports: [RouterLink, MatIconModule, TranslateModule],
  template: `
    <nav class="related" [attr.aria-label]="'RESOURCES.RELATED' | translate">
      <h2>{{ 'RESOURCES.RELATED' | translate }}</h2>
      <ul>
        @for (item of others(); track item.slug) {
          <li>
            <a [routerLink]="item.link">
              <span>
                {{ item.titleKey | translate }}
                <small>{{ item.categoryKey | translate }}</small>
              </span>
              <mat-icon aria-hidden="true">{{ item.icon }}</mat-icon>
            </a>
          </li>
        }
        <li>
          <a routerLink="/amazonia/recursos">
            <span>
              {{ 'COMMON.RESOURCES_ALL' | translate }}
              <small>{{ 'COMMON.RESOURCES' | translate }}</small>
            </span>
            <mat-icon aria-hidden="true">arrow_forward</mat-icon>
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: `
    :host { display: block; }
    .related { margin-top: 4rem; }
    h2 {
      font-family: 'Outfit', system-ui, sans-serif;
      font-size: 0.85rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(203, 213, 225, 0.75);
      margin: 0 0 1rem;
    }
    ul {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 0.9rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      height: 100%;
      box-sizing: border-box;
      padding: 1.1rem 1.25rem;
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(15, 23, 42, 0.6);
      color: #fff;
      text-decoration: none;
      font-family: 'Outfit', system-ui, sans-serif;
      font-weight: 600;
      transition: border-color 0.2s, transform 0.2s;
    }
    a:hover { border-color: var(--accent-line, rgba(45, 212, 191, 0.3)); transform: translateY(-2px); }
    small {
      display: block;
      font-family: 'Inter', system-ui, sans-serif;
      font-weight: 400;
      font-size: 0.82rem;
      color: rgba(203, 213, 225, 0.75);
      margin-top: 0.2rem;
    }
    mat-icon { color: var(--accent, #2dd4bf); flex-shrink: 0; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceRelatedComponent {
  /** Slug del recurso actual, que se excluye de la lista. */
  readonly current = input<string>('');
  readonly others = computed(() => RESOURCES_CATALOG.filter((r) => r.slug !== this.current()));
}

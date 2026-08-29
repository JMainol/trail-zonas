import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

/**
 * Componente de la Página de Misión.
 * Describe la misión del proyecto: Wikipedia 2.0 colaborativa, open source y sin ánimo de lucro
 * sobre la selva amazónica y sus seres vivos.
 */
@Component({
  selector: 'app-mision',
  standalone: true,
  imports: [TranslateModule, RouterModule],
  templateUrl: './mision.component.html',
  styleUrl: './mision.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MisionComponent {}

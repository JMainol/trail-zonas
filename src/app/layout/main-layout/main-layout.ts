import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavMenuComponent } from '../../shared/components/nav-menu/nav-menu.component';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente de Layout Principal.
 * Envuelve el contenido de la aplicación proporcionando una barra de navegación común y un pie de página.
 * Utiliza Content Projection para renderizar el contenido dinámico.
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    NavMenuComponent,
    TranslateModule,
    RouterModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {



  /**
   * Título de la aplicación mostrado en la barra de herramientas.
   */
  title = 'Amazonas Jungle';
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavMenuComponent } from '../../shared/components/nav-menu/nav-menu.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

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
    NavMenuComponent
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
  private router = inject(Router);

  /**
   * Signal que indica si el footer debe ocultarse.
   * El footer solo se muestra en la página de inicio (/).
   */
  hideFooter = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
      map(url => url !== '/')
    ),
    { initialValue: true }
  );

  /**
   * Título de la aplicación mostrado en la barra de herramientas.
   */
  title = 'Amazonas Jungle';
}

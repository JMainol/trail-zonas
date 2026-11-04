import { Directive, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

/** Comportamiento común de las páginas de recursos (botón «Volver»). */
@Directive()
export abstract class ResourcePageBase {
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  goBack(): void {
    // Si se llegó directamente (sin historial interno), vuelve a la portada de Recursos.
    if (typeof window !== 'undefined' && window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/amazonia/recursos');
    }
  }
}


import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-tribus',
    standalone: true,
    imports: [RouterOutlet],
    template: `
    <div class="p-6">
      <h2 class="text-3xl font-bold mb-4 text-green-800">Tribus del Amazonas</h2>
      <p class="mb-6 text-gray-700">Guardianes de la selva y su sabiduría milenaria.</p>
      <router-outlet></router-outlet>
    </div>
  `
})
export class TribusComponent { }

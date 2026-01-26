
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-geografia',
    standalone: true,
    imports: [RouterOutlet],
    template: `
    <div class="p-6">
      <h2 class="text-3xl font-bold mb-4 text-green-800">Geografía y Clima</h2>
      <p class="mb-6 text-gray-700">El escenario físico, desde los Andes hasta el Atlántico.</p>
      <router-outlet></router-outlet>
    </div>
  `
})
export class GeografiaComponent { }

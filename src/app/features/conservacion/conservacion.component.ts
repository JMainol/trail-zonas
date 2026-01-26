
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-conservacion',
    standalone: true,
    imports: [RouterOutlet],
    template: `
    <div class="p-6">
      <h2 class="text-3xl font-bold mb-4 text-green-800">Conservación y Desafíos</h2>
      <p class="mb-6 text-gray-700">El frágil equilibrio y la urgencia de proteger la Amazonía.</p>
      <router-outlet></router-outlet>
    </div>
  `
})
export class ConservacionComponent { }


import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-ecosistemas-acuaticos',
    standalone: true,
    imports: [RouterOutlet],
    template: `
    <div class="p-6">
      <h2 class="text-3xl font-bold mb-4 text-green-800">Ecosistemas Acuáticos</h2>
      <p class="mb-6 text-gray-700">Mundos sumergidos: bosques inundados y lagos misteriosos.</p>
      <router-outlet></router-outlet>
    </div>
  `
})
export class EcosistemasAcuaticosComponent { }

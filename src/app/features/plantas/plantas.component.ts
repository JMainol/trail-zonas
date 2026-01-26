
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-plantas',
    standalone: true,
    imports: [RouterOutlet],
    template: `
    <div class="p-6">
      <h2 class="text-3xl font-bold mb-4 text-green-800">Plantas de la Amazonía</h2>
      <p class="mb-6 text-gray-700">Descubre la inmensa variedad vegetal, desde el suelo del bosque hasta el dosel.</p>
      <router-outlet></router-outlet>
    </div>
  `
})
export class PlantasComponent { }

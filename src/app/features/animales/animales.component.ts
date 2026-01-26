
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-animales',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="h-full">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AnimalesComponent { }

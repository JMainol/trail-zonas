
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tribus',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="p-6">
      <router-outlet></router-outlet>
    </div>
  `
})
export class TribusComponent { }

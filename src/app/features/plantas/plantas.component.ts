
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-plantas',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div>
      <router-outlet></router-outlet>
    </div>
  `
})
export class PlantasComponent { }

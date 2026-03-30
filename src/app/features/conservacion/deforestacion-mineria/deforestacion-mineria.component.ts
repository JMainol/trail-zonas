import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-deforestacion-mineria',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, TranslateModule],
  templateUrl: './deforestacion-mineria.component.html',
  styleUrl: './deforestacion-mineria.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeforestacionMineriaComponent {
    private location = inject(Location);

    protected parallaxTransform = signal('');

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        const x = (event.clientX - window.innerWidth / 2) * -0.02;
        const y = (event.clientY - window.innerHeight / 2) * -0.02;
        this.parallaxTransform.set(`translate(${x}px, ${y}px)`);
    }

    goBack() {
        this.location.back();
    }
}

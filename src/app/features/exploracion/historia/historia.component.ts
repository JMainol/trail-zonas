import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-historia',
    standalone: true,
    imports: [CommonModule, MatIconModule, RouterModule, TranslateModule],
    templateUrl: './historia.component.html',
    styleUrl: './historia.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoriaComponent {
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

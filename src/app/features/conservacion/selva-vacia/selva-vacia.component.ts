import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-selva-vacia',
    standalone: true,
    imports: [CommonModule, MatIconModule, RouterModule, TranslateModule],
    templateUrl: './selva-vacia.component.html',
    styleUrl: './selva-vacia.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelvaVaciaComponent {
    private readonly location = inject(Location);

    goBack(): void {
        this.location.back();
    }
}

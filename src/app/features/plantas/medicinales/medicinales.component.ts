import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-medicinales',
    standalone: true,
    templateUrl: './medicinales.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MedicinalesComponent { }

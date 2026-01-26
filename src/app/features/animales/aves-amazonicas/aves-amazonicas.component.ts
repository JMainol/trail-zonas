
import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-aves-amazonicas',
  standalone: true,
  imports: [],
  templateUrl: './aves-amazonicas.component.html',
  styleUrl: './aves-amazonicas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvesAmazonicasComponent {
  // Signal to store the transform string
  protected parallaxTransform = signal('');

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    // Calculate offset from center
    const x = (event.clientX - window.innerWidth / 2) * -0.02;
    const y = (event.clientY - window.innerHeight / 2) * -0.02;

    // Update signal
    this.parallaxTransform.set(`translate(${x}px, ${y}px)`);
  }
}

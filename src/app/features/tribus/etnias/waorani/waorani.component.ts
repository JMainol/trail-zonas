import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild, inject, signal, effect } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-waorani',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule, MatIconModule],
    templateUrl: './waorani.component.html',
    styleUrl: './waorani.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaoraniComponent {
    private sanitizer = inject(DomSanitizer);
    private location = inject(Location);

    // Video URL
    protected videoUrl = signal<SafeResourceUrl>(
        this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/xen2Drp47iI?si=W-n-v8EpB5am6VZ0')
    );

    // Signal for parallax
    protected parallaxTransform = signal('');

    // Tab control
    protected activeTab = signal('video'); // 'video', 'info', 'photos'
    protected isExpanded = signal(false);

    // Gallery Slider — 4 local images, 5th slot is the Getty embed
    protected galleryImages = [
        'assets/images/tribes/waorani/waorani_hombre_mayor_hombre_joven.jpg',
        'assets/images/tribes/waorani/miembros_tribu_waorani.jpg',
        'assets/images/tribes/waorani/hombre_waorani_cerbatana.png',
        'assets/images/tribes/waorani/hombre_waorani_con_mono.png',
        'getty' // sentinel value — renders the Getty embed instead of an <img>
    ];
    protected currentPhotoIndex = signal(0);

    // Reference to the Getty embed container in the DOM
    @ViewChild('gettyContainer') gettyContainer!: ElementRef<HTMLElement>;

    private gettyScriptLoaded = false;
    private gettyInitialized = false;

    constructor() {
        effect(() => {
            const idx = this.currentPhotoIndex();
            const tab = this.activeTab();
            if (idx === 4 && tab === 'photos') {
                // Reset so we re-initialize each time this slide becomes visible
                this.gettyInitialized = false;
                // Defer until Angular has rendered the container into the DOM
                setTimeout(() => this.initGettyWidget(), 50);
            }
        });
    }

    private initGettyWidget() {
        if (this.gettyInitialized) return;
        const container = this.gettyContainer?.nativeElement;
        if (!container) {
            setTimeout(() => this.initGettyWidget(), 100);
            return;
        }

        // Inject the anchor element Getty needs
        container.innerHTML = '';
        const anchor = document.createElement('a');
        anchor.id = 'k8nsosn-Ty9dr4-myrbHfQ';
        anchor.className = 'gie-single';
        anchor.href = 'https://www.gettyimages.com/detail/1139351099';
        anchor.target = '_blank';
        anchor.style.cssText = 'color:#a7a7a7;text-decoration:none;font-weight:normal!important;border:none;display:inline-block;';
        anchor.textContent = 'Embed from Getty Images';
        container.appendChild(anchor);

        // ── Getty's official queue pattern ──────────────────────────────
        // This mirrors exactly what their embed snippet does inline:
        //   window.gie = window.gie || function(c){(gie.q=gie.q||[]).push(c)};
        //   gie(function(){ gie.widgets.load({...}) });
        // The key: set up the queue BEFORE the script loads, then push the
        // config into it. When widgets.js loads it drains the queue itself.
        const w = window as any;
        w.gie = w.gie || function (c: Function) {
            (w.gie.q = w.gie.q || []).push(c);
        };

        // Push our widget config into the queue
        w.gie(function () {
            w.gie.widgets.load({
                id: 'k8nsosn-Ty9dr4-myrbHfQ',
                sig: 'c3D4VlWhr2rNTNx801pRxGkvls-X_vrXYCWu3-G_nzc=',
                w: '594px',
                h: '395px',
                items: '1139351099',
                caption: true,
                tld: 'com',
                is360: false
            });
        });

        this.gettyInitialized = true;

        // Load the script once — it will drain the queue on load
        if (!this.gettyScriptLoaded) {
            this.gettyScriptLoaded = true;
            const existing = document.getElementById('getty-embed-script');
            if (existing) {
                // Script already loaded but gie queue may need to be flushed
                // (this handles revisiting the slide after initial load)
                return;
            }
            const script = document.createElement('script');
            script.id = 'getty-embed-script';
            script.src = 'https://embed-cdn.gettyimages.com/widgets.js';
            script.charset = 'utf-8';
            script.async = true;
            document.body.appendChild(script);
        }
    }

    toggleExpanded() {
        this.isExpanded.set(!this.isExpanded());
    }

    nextPhoto() {
        this.currentPhotoIndex.update(i => (i + 1) % this.galleryImages.length);
    }

    prevPhoto() {
        this.currentPhotoIndex.update(i => (i - 1 + this.galleryImages.length) % this.galleryImages.length);
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        const x = (event.clientX - window.innerWidth / 2) * -0.02;
        const y = (event.clientY - window.innerHeight / 2) * -0.02;
        this.parallaxTransform.set(`translate(${x}px, ${y}px)`);
    }

    setTab(tab: string) {
        this.activeTab.set(tab);
    }

    goBack() {
        this.location.back();
    }
}

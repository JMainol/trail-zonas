import {
    Component,
    OnInit,
    OnDestroy,
    inject,
    PLATFORM_ID,
    ChangeDetectionStrategy,
    signal,
    AfterViewInit
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-mapa',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './mapa.component.html',
    styleUrls: ['./mapa.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapaComponent implements AfterViewInit, OnDestroy {
    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);

    private map?: L.Map;
    // Signal para manejar la reserva seleccionada de forma ultra-eficiente
    public selectedReserve = signal<any>(null);

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.initMap();
            this.loadReservesFromJson();
        }
    }

    private initMap(): void {
        this.map = L.map('map', {
            center: [-8.0, -65.0],
            zoom: 5,
            zoomControl: false,
            preferCanvas: true // OPTIMIZACIÓN: Dibuja polígonos en Canvas, no en SVG
        });

        // Capas base (Satélite y Etiquetas)
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}')
            .addTo(this.map);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png')
            .addTo(this.map);

        setTimeout(() => this.map?.invalidateSize(), 100);
    }

    getFeatureStyle(feature: any): L.PathOptions {
        const colors: { [key: string]: string } = {
            Peru: '#FFEB3B', Brazil: '#00E676', Bolivia: '#FF5252',
            Colombia: '#29B6F6', Ecuador: '#FF9800', Venezuela: '#E91E63',
        };

        return {
            color: colors[feature.properties.country] || '#FFFFFF',
            weight: 1,
            fillOpacity: 0.25,
            fillColor: colors[feature.properties.country],
            lineJoin: 'round',
        };
    }

    private loadReservesFromJson(): void {
        this.http.get('assets/reserves.json').subscribe({
            next: (data: any) => {
                const geoLayer = L.geoJSON(undefined, {
                    style: (f) => this.getFeatureStyle(f),
                    onEachFeature: (feature, layer) => {
                        this.setupFeatureEvents(feature, layer, geoLayer);
                    }
                });

                geoLayer.addData(data);
                geoLayer.addTo(this.map!);

                if (geoLayer.getBounds().isValid()) {
                    this.map?.fitBounds(geoLayer.getBounds(), { padding: [30, 30] });
                }
            },
            error: (err) => console.error('Error al cargar datos geográficos:', err)
        });
    }

    private setupFeatureEvents(feature: any, layer: L.Layer, parentLayer: L.GeoJSON): void {
        // Tooltip elegante
        layer.bindTooltip(feature.properties.name, {
            sticky: true,
            direction: 'top',
            className: 'reserva-tooltip'
        });

        layer.on('mouseover', (e) => {
            const poly = e.target as L.Polygon;
            poly.setStyle({ fillOpacity: 0.7, weight: 1.5, color: '#FFFFFF' });
            poly.bringToFront();
        });

        layer.on('mouseout', (e) => {
            parentLayer.resetStyle(e.target);
        });

        layer.on('click', (e) => {
            const poly = e.target as L.Polygon;
            this.selectedReserve.set(feature.properties); // Actualiza Signal
            this.map?.flyToBounds(poly.getBounds(), { padding: [50, 50], duration: 1.5 });
        });
    }

    ngOnDestroy(): void {
        if (this.map) this.map.remove(); // Limpieza de memoria crítica
    }
}
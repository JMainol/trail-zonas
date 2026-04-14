import { Injectable, makeStateKey, TransferState } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TranslateServerLoader implements TranslateLoader {
    private readonly suffix: string = '.json';

    constructor(private transferState: TransferState) { }

    public getTranslation(lang: string): Observable<any> {
        const key = makeStateKey<any>('translate-' + lang);

        // Determinar ruta de los assets de forma no bloqueante para el event loop de Node
        const primaryPath = path.join(process.cwd(), 'src', 'assets', 'i18n', `${lang}${this.suffix}`);
        const fallbackPath = path.join(process.cwd(), 'public', 'assets', 'i18n', `${lang}${this.suffix}`);

        // Intentar leer el archivo primario de forma asíncrona (no bloqueante)
        return from(fs.promises.readFile(primaryPath, 'utf8')).pipe(
            catchError(() =>
                // Si falla el primario, intentar el fallback también de forma asíncrona
                from(fs.promises.readFile(fallbackPath, 'utf8'))
            ),
            map(data => {
                const translations = JSON.parse(data);
                // Guardar en TransferState para que el cliente lo reciba en el HTML
                this.transferState.set(key, translations);
                return translations;
            }),
            catchError(error => {
                console.error(`[TranslateServerLoader] No se encontró el archivo de traducción para "${lang}".`, error);
                return of({});
            })
        );
    }
}

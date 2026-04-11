import { Injectable, makeStateKey, TransferState } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TranslateServerLoader implements TranslateLoader {
    private prefix: string = 'assets/i18n/';
    private suffix: string = '.json';

    constructor(private transferState: TransferState) { }

    public getTranslation(lang: string): Observable<any> {
        const key = makeStateKey<any>('translate-' + lang);

        // Intenta obtener del TransferState por si acaso (aunque es el servidor)
        if (this.transferState.hasKey(key)) {
            return of(this.transferState.get(key, {}));
        }

        // Determinar ruta de los assets en tiempo de ejecución de Node
        let assetsPath = path.join(process.cwd(), 'src', 'assets', 'i18n', `${lang}${this.suffix}`);

        if (!fs.existsSync(assetsPath)) {
            assetsPath = path.join(process.cwd(), 'public', 'assets', 'i18n', `${lang}${this.suffix}`);
        }

        if (fs.existsSync(assetsPath)) {
            try {
                const data = fs.readFileSync(assetsPath, 'utf8');
                const translations = JSON.parse(data);
                
                // Guardar en TransferState para que el cliente lo reciba en el HTML
                this.transferState.set(key, translations);
                
                return of(translations);
            } catch (error) {
                console.error(`Error parsing translation file: ${assetsPath}`, error);
                return of({});
            }
        }

        console.error(`Could not find translation file: ${assetsPath}`);
        return of({});
    }
}
